import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { TweenLite } from 'gsap/TweenLite'
import { TweenMax } from 'gsap/TweenMax'
import uniqid from 'uniqid'

const cloneDomElement = (el, newClass) => {
  // clone the element
  const clone = el.cloneNode(true)
  clone.classList.remove(el.classList)
  clone.classList.add(newClass)
  return clone
}

const wrapDomElement = (el, newClass) => {
  const wrapper = document.createElement('div')
  wrapper.classList.add(newClass)
  wrapper.appendChild(el)
  return wrapper
}

const getSwiper = (store, galleryName) => {
  if (typeof store.swipers[galleryName] === 'undefined') return createSwiper(store, galleryName)
  else {
    const swiper = store.swipers[galleryName]
    if (swiper.el.querySelector('.swiper-button-exit') !== null) {
      const buttonExit = swiper.el.querySelector('.swiper-button-exit')
      const oldKey = buttonExit.getAttribute('data-vue-global-id')

      // unbind dei vecchi eventi
      if (typeof store.events[oldKey] !== 'undefined') {
        store.events[oldKey].forEach(event => {
          buttonExit.removeEventListener('click', event)
        })
      }

      // bind dei nuovi eventi
      store.events[oldKey] = [
        closeGallery.bind(undefined, store, swiper, galleryName)
      ]
      store.events[oldKey].forEach(event => {
        buttonExit.addEventListener('click', event)
      })
    }
    return swiper
  }
}

const createSwiper = async (store, galleryName) => {
  // gallery container
  const container = document.createElement('div')
  container.classList.add('swiper-container')

  // images wrapper
  const wrapper = document.createElement('div')
  wrapper.classList.add('swiper-wrapper')
  container.appendChild(wrapper)

  // prev, next and close buttons
  const buttonPrev = document.createElement('div')
  buttonPrev.classList.add('swiper-button-prev')
  container.appendChild(buttonPrev)

  const buttonNext = document.createElement('div')
  buttonNext.classList.add('swiper-button-next')
  container.appendChild(buttonNext)

  // swiper lib create
  const swiper = new Swiper(container, store.swiperOptions)

  // save to store
  store.swipers[galleryName] = swiper

  // append the swiper Node to the DOM
  const swiperContainer = await waitForExistance('.' + galleryName)
  swiperContainer.appendChild(container)

  store.containers[galleryName] = swiperContainer

  // close swiper element and event
  const key = uniqid()
  const buttonExit = document.createElement('div')
  buttonExit.classList.add('swiper-button-exit')
  buttonExit.setAttribute('data-vue-global-id', key)
  container.appendChild(buttonExit)

  store.events[key] = [
    closeGallery.bind(undefined, store, swiper, galleryName)
  ]
  store.events[key].forEach(event => {
    buttonExit.addEventListener('click', event)
  })
  // buttonExit.addEventListener('click', closeGallery.bind(undefined, store, swiper, galleryName))

  // next e prev swiper events
  buttonPrev.addEventListener('click', () => swiper.slidePrev(400))
  buttonNext.addEventListener('click', () => swiper.slideNext(400))

  // on transition slider
  swiper.on('slideChangeTransitionEnd', () => {
    // nascondo - faccio vedere le immagini originali
    const activeIndex = swiper.activeIndex
    const key = swiper.slides[activeIndex].getAttribute('data-vue-global-id')
    showHideOriginal(store, galleryName, key)
    // faccio vedere le altre slide
    const slides = Array.prototype.slice.call(swiperContainer.querySelectorAll('.swiper-slide'))
    slides.forEach(function (element, elementIndex) {
      if (elementIndex !== swiper.activeIndex) { TweenLite.to(element.querySelector('.swiper-slide__img'), 0, { opacity: 1 }) }
    })
  })

  // start from first slide
  swiperSlideTo(swiper, 0)

  return swiper
}

// add on the store the original image containing the directive
const addOriginal = (store, galleryName, el) => {
  if (typeof store.originalSlides[galleryName] === 'undefined') { store.originalSlides[galleryName] = {} }
  store.originalSlides[galleryName][el.getAttribute('data-vue-global-id')] = el
  return el
}

// remove on the store a original image
const removeOriginal = (store, oldGalleryName, el) => {
  const originalKeys = Object.keys(store.originalSlides[oldGalleryName])
  const cleanKeys = originalKeys.filter(key => key !== el.dataset.vueGlobalId)

  // create a new obj containing only clean values
  const originalSlides = cleanKeys.reduce((newStore, key) => {
    return Object.assign({}, newStore, { [key]: store.originalSlides[oldGalleryName][key] })
  }, {})
  store.originalSlides[oldGalleryName] = originalSlides
}

// drag en element from the DOM to the slider, and viceversa
const dragElement = (el, wrappedClone) => {
  // clone the element to move
  const clone = cloneDomElement(el, 'cloned__img')
  document.body.appendChild(clone)

  // get origin and destination of the clone
  const fromRect = el.getBoundingClientRect()
  const toRect = wrappedClone.getBoundingClientRect()

  TweenLite.to(wrappedClone, 0, { opacity: 0 })

  TweenMax.fromTo(
    clone,
    0.5,
    {
      position: 'fixed',
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
      zIndex: 10,
      opacity: 1
    },
    {
      top: toRect.top,
      left: toRect.left,
      width: toRect.width,
      height: toRect.height,
      onComplete: () => {
        clone.remove()
        TweenLite.to(wrappedClone, 0, { opacity: 1 })
      }
    }
  )
}

// move the swiper to the slide "index"
const swiperSlideTo = (swiper, index) => {
  swiper.slideTo(index, 0, true)
}

// show and hide the original images, depending on wich is clicked
const showHideOriginal = (store, galleryName, key) => {
  Object.keys(store.originalSlides[galleryName]).forEach(currentKey => {
    if (currentKey === key) {
      TweenLite.to(store.originalSlides[galleryName][currentKey], 0, { opacity: 0 })
    } else {
      TweenLite.to(store.originalSlides[galleryName][currentKey], 0.5, { opacity: 1 })
    }
  })
}

// close the gallery
const closeGallery = (store, swiper, galleryName) => {
  const activeIndex = swiper.activeIndex
  const from = swiper.slides[activeIndex].querySelector('.swiper-slide__img')

  const key = swiper.slides[activeIndex].getAttribute('data-vue-global-id')
  const to = store.originalSlides[galleryName][key]

  dragElement(from, to)
  TweenLite.to(from, 0, { opacity: 0 })
  sendEvent(galleryName, 'close')
}

const sendEvent = (galleryName, eventTitle) => {
  document.querySelector('.' + galleryName).dispatchEvent(new window.Event(eventTitle))
}

const updateSwiper = swiper => {
  swiper.update()
  swiper.detachEvents()
  swiper.attachEvents()
}

const removeSlide = (container, swiper, el) => {
  const cleanSlides = Array.apply(null, Array(swiper.slides.length))
    .map((x, i) => i)
    .map(slide => swiper.slides[slide])

  const removeSlide = cleanSlides.find(slide => slide.dataset.vueGlobalId === el.dataset.vueGlobalId)
  swiper.removeSlide(cleanSlides.indexOf(removeSlide))
}

// WAIT FOR DOM EXISTANCE FUNCS

const elementExists = elementClass => document.querySelector(elementClass) !== null

const startElementPolling = (selector, callback) => {
  if (elementExists(selector)) return callback(document.querySelector(selector))
  window.requestAnimationFrame(startElementPolling.bind(undefined, selector, callback))
}

const waitForExistance = selector => new Promise((resolve, reject) => {
  startElementPolling(selector, resolve)
})

export default {
  cloneDomElement,
  wrapDomElement,
  getSwiper,
  dragElement,
  addOriginal,
  swiperSlideTo,
  showHideOriginal,
  sendEvent,
  removeOriginal,
  updateSwiper,
  removeSlide
}

import store from './store'
import utils from './utils'
import uniqid from 'uniqid'

const VueGlobalImagesGallery = {
  // v-global-images-gallery="{ active: true, galleryName: 'pagina-vini', slideIndex: 1 }"
  install (Vue, options) {
    Vue.directive('global-images-gallery', {
      async bind (el, binding) {
        // extract data
        const { galleryName, slideIndex, active } = binding.value

        // if disabled
        if (!active) return

        // clone the input and assign a new class
        const clone = utils.cloneDomElement(el, 'swiper-slide__img')
        const wrappedClone = utils.wrapDomElement(clone, 'swiper-slide')

        const key = uniqid()

        wrappedClone.setAttribute('data-vue-global-id', key)
        el.setAttribute('data-vue-global-id', key)

        // get the selected swiper
        const swiperRef = await utils.getSwiper(store, galleryName)

        // insert the clone inside the selected swiper
        swiperRef.addSlide(slideIndex, wrappedClone)

        // add the element to the store original images
        utils.addOriginal(store, galleryName, el)

        // array of events
        store.events[key] = [
          utils.swiperSlideTo.bind(undefined, swiperRef, slideIndex),
          utils.dragElement.bind(undefined, el, clone),
          utils.showHideOriginal.bind(undefined, store, galleryName, key),
          utils.sendEvent.bind(undefined, galleryName, 'open'),
          utils.updateSwiper.bind(undefined, swiperRef)
        ]

        store.events[key].forEach(event => {
          el.addEventListener('click', event)
        })

        // in caso di unbind a galleria aperta
        utils.sendEvent(galleryName, 'close')
        utils.showHideOriginal(store, galleryName, 'all')
      },
      async componentUpdated (el, binding, vnode, oldVnode) {
        // get old data
        const oldActive = binding.oldValue.active
        const oldGalleryName = binding.oldValue.galleryName
        const oldSwiper = utils.getSwiper(store, oldGalleryName)

        if (oldActive) {
          // console.log('oldIndex', oldSlideIndex, 'was active')

          const oldKey = el.getAttribute('data-vue-global-id')

          if (typeof store.events[oldKey] !== 'undefined') {
            store.events[oldKey].forEach(event => {
              el.removeEventListener('click', event)
            })
          }

          // remove the record inside the store
          utils.removeOriginal(store, oldGalleryName, el)
          // console.log('update, removeoriginal', el)
          // console.table(Object.keys(store.originalSlides[oldGalleryName]).map(key => store.originalSlides[oldGalleryName][key].dataset.vueGlobalId))

          // search me on all the slides and remove if exist
          utils.removeSlide(store.containers[oldGalleryName], store.swipers[oldGalleryName], el)

          utils.updateSwiper.bind(undefined, oldSwiper)
        }

        // extract new data
        const { galleryName, slideIndex, active } = binding.value

        // if disabled
        if (!active) return

        // clone the input and assign a new class
        const clone = utils.cloneDomElement(el, 'swiper-slide__img')
        const wrappedClone = utils.wrapDomElement(clone, 'swiper-slide')

        const key = uniqid()

        wrappedClone.setAttribute('data-vue-global-id', key)
        el.setAttribute('data-vue-global-id', key)

        utils.addOriginal(store, galleryName, el)
        // console.log('update, addoriginal', el)
        // console.table(Object.keys(store.originalSlides[galleryName]).map(key => store.originalSlides[galleryName][key].dataset.vueGlobalId))

        // get the selected swiper
        const swiperRef = utils.getSwiper(store, galleryName)

        // insert the clone inside the selected swiper
        swiperRef.addSlide(slideIndex, wrappedClone)

        // array of events
        store.events[key] = [
          utils.swiperSlideTo.bind(undefined, swiperRef, slideIndex),
          utils.dragElement.bind(undefined, el, clone),
          utils.showHideOriginal.bind(undefined, store, galleryName, key),
          utils.sendEvent.bind(undefined, galleryName, 'open'),
          utils.updateSwiper.bind(undefined, swiperRef)
        ]

        store.events[key].forEach(event => {
          el.addEventListener('click', event)
        })
      },
      unbind (el, binding) {
        // extract data
        const { galleryName } = binding.value

        // in caso di unbind a galleria aperta
        utils.sendEvent(galleryName, 'close')
        utils.showHideOriginal(store, galleryName, 'all')

        // get the selected swiper
        const swiperRef = utils.getSwiper(store, galleryName)

        // remove the clone inside the selected swiper
        utils.removeSlide(store.containers[galleryName], swiperRef, el)

        // update the swiper
        utils.updateSwiper.bind(undefined, swiperRef)

        // remove the record inside the store
        utils.removeOriginal(store, galleryName, el)
        // console.log('unbind, removeOriginal', el, slideIndex)
        // console.table(Object.keys(store.originalSlides[galleryName]).map(key => store.originalSlides[galleryName][key].dataset.vueGlobalId))
      }
    })
  }
}

export default VueGlobalImagesGallery

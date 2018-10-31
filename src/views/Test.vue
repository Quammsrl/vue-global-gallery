<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Gallery page</h1>
    <section class="listing">

      <picture
        v-for="(id, index) of images"
        :key="id"
        class="vue__global-images-gallery__image"
        v-global-images-gallery="{ active, galleryName: 'pagina-vini', slideIndex: index }">
        <source media="(min-width: 1024px)" :srcset="'/' + id + '-medium.png'">
        <source media="(min-width: 1440px)" :srcset="'/' + id + '-large.png'">
        <source media="(min-width: 1800px)" :srcset="'/' + id + '.png'">
        <img :src="'/' + id + '.png'">
      </picture>

    </section>

    <div
      @open="onOpen"
      @close="onClose"
      class="pagina-vini">
    </div>

  </div>
</template>

<script>

import { TweenLite } from 'gsap/TweenLite'
import store from '../plugins/VueGlobalImagesGallery/store'

export default {
  data: () => ({
    active: true,
    images: [320, 321, 322, 323]
  }),
  methods: {
    onOpen () {
      const container = document.querySelector('.pagina-vini')
      container.style.visibility = 'visible'
      TweenLite.to(container, 0.5, { opacity: 1 })
    },
    onClose () {
      const container = document.querySelector('.pagina-vini')
      TweenLite.to(
        container,
        0.5,
        {
          opacity: 0,
          onComplete: () => {
            container.style.visibility = 'hidden'
          }
        }
      )
    }
  },
  beforeMount () {
    store.swipers = {}
    store.originalSlides = {}
    store.containers = {}
    store.events = {}
    console.log('store vuoto', store)
  }
}
</script>

<style lang="scss">

  body{
    margin: 0
  }

  .vue__global-images-gallery__image{
    float: left; width: 25%;
    display: block;
    img{
      width: 100%;
      height: auto;
    }
  }

  .swiper-container{
    background-color: #dedede;
    width: 100%;
    height: 100%;

    .swiper-wrapper{
      backface-visibility: hidden;
      will-change: transform;

      .swiper-slide__img{
        margin: 0 20%; width: 60%;
        cursor: zoom-in;
        display: block;

        img{
          width: 100%;
          height: auto;
        }

      }
    }
  }

  .swiper-button-exit {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
    cursor: pointer;
    z-index: 10;
  }
  .swiper-button-exit:hover {
    opacity: 1;
  }
  .swiper-button-exit:before, .swiper-button-exit:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  .swiper-button-exit:before {
    transform: rotate(45deg);
  }
  .swiper-button-exit:after {
    transform: rotate(-45deg);
  }

  .pagina-vini{
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    background-color: #333;
    opacity: 0;
    visibility: hidden;
    z-index: 10;
  }

  .cloned__img{
    text-align: center;

    img{
      width: 100%;
      height: auto;
    }

  }

</style>

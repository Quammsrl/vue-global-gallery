<template>
  <div
    v-global-images-gallery="{
      className: '.vue__global-images-gallery__image',
      containerSelector: '.ciccio',
      options: {
        speed: 400,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      }
    }"
    class="test">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Gallery page</h1>
    <section class="listing">

      <picture
        v-for="id of images"
        :key="id"
        class="vue__global-images-gallery__image">
        <source media="(min-width: 1024px)" :srcset="'/' + id + '-medium.png'">
        <source media="(min-width: 1440px)" :srcset="'/' + id + '-large.png'">
        <source media="(min-width: 1800px)" :srcset="'/' + id + '.png'">
        <img :src="'/' + id + '.png'">
      </picture>

      <!--
      <img
        v-for="id of images"
        :key="id"
        class="vue__global-images-gallery__image"
        :src="'/' + id + '.png'"
        :srcset="'/' + id + '-large.png 1440w, /' + id + '-medium.png 1024w, /' + id + '.png 1800w'">
      -->
    </section>

    <div
      @open="onOpen"
      @close="onClose"
      class="ciccio">
    </div>

  </div>
</template>

<script>

import { TweenLite } from 'gsap/TweenLite'

export default {
  data: () => ({
    images: [320, 321, 322, 323]
  }),
  methods: {
    onOpen () {
      const container = document.querySelector('.ciccio')
      container.style.visibility = 'visible'
      TweenLite.to(container, 0.5, { opacity: 1 })
    },
    onClose () {
      const container = document.querySelector('.ciccio')
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

  .ciccio{
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

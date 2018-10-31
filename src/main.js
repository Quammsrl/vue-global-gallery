import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGlobalImagesGallery from './plugins/VueGlobalImagesGallery/index'

Vue.config.productionTip = false

Vue.use(VueGlobalImagesGallery)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

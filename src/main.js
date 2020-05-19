import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/sass/style.scss'
import 'bootstrap/scss/bootstrap.scss'
import 'jquery/dist/jquery.min'
import 'bootstrap/dist/js/bootstrap.bundle'

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');


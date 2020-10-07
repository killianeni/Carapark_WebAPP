import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {BootstrapVue} from 'bootstrap-vue';

import './assets/fonts/icons/kmap-icons.css';
import {AUTH_SUCCESS} from '@/store/actions/auth';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

const userToken = localStorage.getItem('user-token');
const userRole = localStorage.getItem('user-role');

if (userToken && userRole)
{
  store.commit(AUTH_SUCCESS,{token: userToken, role: userRole});
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

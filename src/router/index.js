import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard.vue';
import PortalPark from '../views/module-park/Portal.vue';
import SitePark from '../views/module-park/Site.vue';
import CarPark from '../views/module-park/Car.vue';
import PortalReserve from '../views/module-reserve/Portal.vue';
import SiteReserve from '../views/module-reserve/Site.vue';
import User from '../views/module-user/User.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/park',
    name: 'PortalPark',
    component: PortalPark
  },
  {
    path: '/park/site',
    name: 'SitePark',
    component: SitePark
  },
  {
    path: '/park/car',
    name: 'CarPark',
    component: CarPark
  },
  {
    path: '/reserve',
    name: 'PortalReserve',
    component: PortalReserve
  },
  {
    path: '/reserve/site',
    name: 'SiteReserve',
    component: SiteReserve
  },
  {
    path: '/user',
    name: 'User',
    component: User
  }
];

const router = new VueRouter({
  routes
});

export default router;

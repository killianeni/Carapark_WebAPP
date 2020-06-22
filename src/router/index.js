import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard.vue';
import ParkPortal from '../views/module-park/ParkPortal.vue';
import ParkCar from '../views/module-park/ParkCar.vue';
import ReservePortal from '../views/module-reserve/ReservePortal.vue';
import ReserveSite from '../views/module-reserve/ReserveSite.vue';
import UserPortal from '../views/module-user/UserPortal.vue';
import UserList from '../views/module-user/UserList.vue';
import store from '../store';

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/login');
};

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Tableau de bord',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Connexion',
    },
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/park-portal',
    name: 'ParkPortal',
    component: ParkPortal,
    meta: {
      title: 'Parc',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/park-portal/:id/cars',
    name: 'ParkCar',
    component: ParkCar,
    meta: {
      title: 'Voitures du site :',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/reserve-portal',
    name: 'ReservePortal',
    component: ReservePortal,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/reserve/site',
    name: 'ReserveSite',
    component: ReserveSite,
    beforeEnter: ifAuthenticated
  },
  {
    path: '/user-portal',
    name: 'UserPortal',
    component: UserPortal,
    meta: {
      title: 'Utilisateurs',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/user-portal/:id/users',
    name: 'UserList',
    component: UserList,
    meta: {
      title: 'Utilisateurs du site :',
    },
    beforeEnter: ifAuthenticated
  }
];

const router = new VueRouter({
  routes
});

export default router;

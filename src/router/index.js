import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import Dashboard from '../views/Dashboard.vue';
import ParkPortal from '../views/module-park/ParkPortal.vue';
import ParkCar from '../views/module-park/ParkCar.vue';
import ReservePortal from '../views/module-reserve/ReservePortal.vue';
import ReserveListSite from '../views/module-reserve/ReserveListSite.vue';
import ReserveListUser from '../views/module-reserve/ReserveListUser.vue';
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
    },
    beforeEnter: ifAuthenticated
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
      title: 'Voitures de',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/reserve-list-user',
    name: 'ReserveListUser',
    component: ReserveListUser,
    meta: {
      title: 'Mes Réservations',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/reserve-portal',
    name: 'ReservePortal',
    component: ReservePortal,
    meta: {
      title: 'Réservations',
    },
    beforeEnter: ifAuthenticated
  },
  {
    path: '/reserve-portal/:id/reserves-site',
    name: 'ReserveListSite',
    component: ReserveListSite,
    meta: {
      title: 'Réservations de',
    },
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
      title: 'Utilisateurs de',
    },
    beforeEnter: ifAuthenticated
  }
];

const router = new VueRouter({
  routes
});

export default router;

import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from '../actions/user';
import Vue from 'vue';
import {AUTH_LOGOUT} from '../actions/auth';
import {api} from '@/config';

const state = {status: '', user: {}, site: []};

const getters = {
  userLogged: state => state.user,
  isUserLoaded: state => !!state.user.id,
  siteByCompany: state => state.site
};

const actions = {
  [USER_REQUEST]: async ({commit, dispatch}, data) => {
    commit(USER_REQUEST);
    try {
      const token = localStorage.getItem('user-token');
      const idEntreprise = data.user.idEntreprise;
      const sites = await api.url(`/api/Sites/GetSitebyEntreprise/${idEntreprise}/utilisateur`)
        .headers({"Authorization": "Bearer " + token})
        .get()
        .json();
      // const usersByEntreprise = await api.url(`/api/Utilisateurs/GetUtilisateursbySite/${idEntreprise}`)
      //   .headers({"Authorization": "Bearer " + token})
      //   .get()
      //   .json();
      commit(USER_SUCCESS, {user: data.user, site: sites});
    } catch (err) {
      commit(USER_ERROR);
      dispatch(AUTH_LOGOUT);
    }
  }
};

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading';
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success';
    Vue.set(state, 'user', resp.user);
    Vue.set(state, 'site', resp.site);
  },
  [USER_ERROR]: state => {
    state.status = 'error';
  },
  [AUTH_LOGOUT]: state => {
    state.profile = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

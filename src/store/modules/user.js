import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from '../actions/user';
import Vue from 'vue';
import {AUTH_LOGOUT} from '../actions/auth';
// import {api} from "../../config";

const state = {status: '', profile: {}};

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.id
};

const actions = {
  [USER_REQUEST]: async ({commit, dispatch}, dataUser) => {
    commit(USER_REQUEST);
    try {
      commit(USER_SUCCESS, dataUser);
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
    Vue.set(state, 'profile', resp);
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

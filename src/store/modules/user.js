import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from '../actions/user';
import {AUTH_LOGOUT} from '../actions/auth';
// import {api} from "../../config";

const state = {status: '', user: {}};

const getters = {
  userLogged: state => state.user,
  isUserLoaded: state => !!state.user.id
};

const actions = {
  [USER_REQUEST]: async ({commit, dispatch}, data) => {
    commit(USER_REQUEST);
    try {
      // const token = localStorage.getItem('user-token');
      // const users = await api.url('/api/utilisateurs')
      //   .headers({"Authorization": "Bearer " +  token})
      //   .get()
      //   .json();
      commit(USER_SUCCESS, {user: data});
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
    state.user = resp.user;
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

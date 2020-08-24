import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '../actions/auth';
import {USER_REQUEST} from '../actions/user';
import {api} from '@/config';

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  isAdmin: state => !!state.admin
};

const actions = {
  [AUTH_REQUEST]: async ({commit, dispatch}, user) => {
    commit(AUTH_REQUEST);
    const body = {
      "Mail": user.username,
      "Password": user.password
    };
    try {
      const token = await api.url('/api/token')
        .headers({"Content-Type": "application/json", Accept: "application/json"})
        .post(body).json();
      localStorage.setItem('user-token', token.token);
      commit(AUTH_SUCCESS, {token: token.token, role: token.user.nomRole});
      dispatch(USER_REQUEST, token);
    } catch (err) {
      commit(AUTH_ERROR, err);
      localStorage.removeItem('user-token');
    }
  },
  [AUTH_LOGOUT]: ({commit}) => {
    return new Promise(resolve => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      resolve();
    });
  }
};

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.token = resp.token;
    state.admin = (resp.role === 'admin');
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: state => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: state => {
    state.token = '';
    state.admin = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

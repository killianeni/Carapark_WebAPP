import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '../actions/auth';
import {USER_REQUEST} from '../actions/user';
import {api} from '@/config';

const state = {
  token: '',
  status: '',
  hasLoadedOnce: false,
  admin: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  isAdmin: state => state.admin,
};

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      const body = {
        "Mail": user.username,
        "Password": user.password
      };
      const token = api.url('/api/token')
        .headers({"Content-Type": "application/json", Accept: "application/json"})
        .post(body)
        .json()
        .then(data => {
          localStorage.setItem('user-token', data.token);
          localStorage.setItem('user-role', data.user.role.libelle);
          localStorage.setItem('user', JSON.stringify(data.user));
          commit(AUTH_SUCCESS, {token: data.token, role: data.user.role.libelle});
          dispatch(USER_REQUEST, data.user);
          resolve(token);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.clear();
          reject(err);
        })
    })
  },
  [AUTH_LOGOUT]: ({commit}) => {
    return new Promise(resolve => {
      commit(AUTH_LOGOUT);
      localStorage.clear();
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

/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '../router/index.js';
const api = 'https://quiet-shore-01215.herokuapp.com/merch';

export default {
  namespaced: true,
  state: {
    merchant: null,
    isAuthorized: false,
  },
  getters: {
    merchant: s => s.merchant,
  },
  mutations: {
    setMerchant(state, merchant) {
      state.merchant = merchant;
      localStorage.setItem('merchant', JSON.stringify(merchant));
      state.isAuthorized = true;
    },
    clearMerchant(state) {
      state.merchant = null;
      localStorage.removeItem('merchant');
      state.isAuthorized = false;
    },
    setToken(state, token) {
      Cookies.set('token', token, { expires: 1 });
    },
    clearToken() {
      Cookies.remove('token');
    },
  },
  actions: {
    async signin({ commit }, { mobile, password }) {
      await axios
        .post(api + '/login', { mobile, password })
        .then(res => {
          const { merchant_id: id, merchant_name: name, token } = res.data;
          commit('setMerchant', { id, name });
          commit('setToken', token);
          router.push('/stocks');
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    logout({ commit }) {
      commit('clearMerchant');
      commit('clearToken');
      commit('clearStock', null, { root: true });
      router.push('/signin');
    },
    async refresh({ commit }) {
      const token = Cookies.get('token');
      await axios
        .post(api + '/refresh', { token })
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
          console.log(error);
        });
    },
  },
};

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Cookies from 'js-cookie';
// import router from '../router/index.js';
import merch from './merch.js';
import product from './product/product.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedStock: null,
    stocks: [],
    snackbar: null, // { type: 'error | success | default', status_code: '200-501', message: '' }
  },
  getters: {
    selectedStock: s => s.selectedStock,
    stocks: s => s.stocks,
    snackbar: s => s.snackbar,
  },
  mutations: {
    setStock(state, stock) {
      state.selectedStock = stock;
      localStorage.setItem('stock', JSON.stringify(stock));
    },
    clearStock(state) {
      state.selectedStock = null;
      localStorage.removeItem('stock');
    },
    setStocks(state, stocks) {
      state.stocks = stocks;
    },
    clearStocks(state) {
      state.stocks = [];
    },
    setSnackbar(state, { message = 'Unknown message', status_code = 200, type = 'default' }) {
      state.snackbar = { message, status_code, type };
    },
    clearSnackbar(state) {
      state.snackbar = null;
    }
  },
  actions: {
    initApp({ commit }) {
      const merchant = JSON.parse(localStorage.getItem('merchant'));
      const stock = JSON.parse(localStorage.getItem('stock'));

      commit('setStock', stock);
      commit('merch/setMerchant', merchant);
    },
    async getStocks({ commit }) {
      const token = Cookies.get('token');
      const { id } = JSON.parse(localStorage.getItem('merchant'));

      await axios
        .get(`https://quiet-shore-01215.herokuapp.com/stocks/list/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          commit('setStocks', res.data.stocks)
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        })
    }
  },
  modules: {
    merch,
    product,
  },
});

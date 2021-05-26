/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import { units, headers, categories } from './ui_product.js';
const api = `https://quiet-shore-01215.herokuapp.com`;

export default {
  namespaced: true,
  state: {
    form: {
      id: null,
      barcode: null,
      name: null,
      purchase_price: null,
      selling_price: null,
      amount: null,
      unit: null,
      merchant_id: null,
      created_on: null,
      stock_id: null,
    },
    products: [],
    history: [],
    units,
    headers,
    categories,
    isProductOpen: false,
    isHistoryLoading: false,
    isProductLoading: false,
    product_id: null,
  },
  getters: {
    products: s => s.products,
    history: s => s.history,
    form: s => s.form,
    form_final_price: s => s.form.final_price,
    units: s => s.units,
    categories: s => s.categories,
    selected_unit: s => s.form.unit,
    headers: s => s.headers,
    isProductOpen: s => s.isProductOpen,
    isProductLoading: s => s.isProductLoading,
    isHistoryLoading: s => s.isHistoryLoading,
    product_id: s => s.product_id,
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    clearProducts(state) {
      state.products = [];
    },
    setProductId(state, id) {
      state.product_id = id;
    },
    clearProductId(state) {
      state.product_id = null;
    },
    setForm(state, data) {
      state.form = { ...state.form, ...data };
    },
    clearForm(state) {
      state.form = {
        id: null,
        barcode: null,
        name: null,
        purchase_price: null,
        selling_price: null,
        amount: null,
        unit: null,
        merchant_id: null,
        stock_id: null,
        created_on: null,
      };
      state.units.map(el => {
        el.selected = false;
      });
    },
    toggleProduct(state) {
      state.isProductOpen = !state.isProductOpen;
    },
    setProductLoading(state, value) {
      state.isProductLoading = value;
    },
    setHistoryLoading(state, value) {
      state.isHistoryLoading = value;
    },
    setHistory(state, value) {
      state.history = value;
    },
    clearHistory(state) {
      state.history = null;
    },
    selectUnit(state, value) {
      state.units.map(el => {
        el.selected = false;
      });
      state.form.unit = value || '';
      state.units.find(el => {
        if (el.value == value) {
          el.selected = true;
        }
      });
    },
  },
  actions: {
    toggleProduct({ commit }) {
      commit('clearForm');
      commit('toggleProduct');
    },
    async getProducts({ commit }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const payload = {
        offset: 0,
        limit: 50,
        merchant_id,
        stock_id,
      };

      await axios
        .post(api + '/product/filter', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const products = res.data.products || [];
          commit('setProducts', products);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async getHistory({ commit }, id) {
      const token = Cookies.get('token') || null;
      const paylaod = {
        id,
        limit: 1000,
        offset: 0,
      };

      commit('setHistoryLoading', true);
      await axios
        .post(api + '/transfer/get_list', paylaod, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          commit('setHistory', res.data.transfers || []);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        })
        .finally(_ => {
          commit('setHistoryLoading', false);
        });
    },
    async getProduct({ commit }, id) {
      const token = Cookies.get('token') || null;
      commit('setProductLoading', true);
      await axios
        .get(`${api}/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const product = res.data.product || {};
          commit('setForm', product);
          commit('setProductId', product.id);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        })
        .finally(_ => {
          commit('setProductLoading', false);
        });
    },
    async createProduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));

      const product = { ...getters.form, merchant_id, stock_id };

      await axios
        .post(
          api + '/product',
          { product },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(_ => {
          commit(
            'setSnackbar',
            { message: 'Successfully created!', type: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async deleteProduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const id = getters.product_id;

      await axios
        .delete(`${api}/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(_ => {
          commit(
            'setSnackbar',
            { message: 'Successfully deleted!', type: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async updateProduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));

      const product = { ...getters.form, merchant_id, stock_id };

      await axios
        .put(
          api + '/product',
          { product },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(_ => {
          commit(
            'setSnackbar',
            { message: 'Successfully saved!', type: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async multipleDeleteProduct({ commit }, ids) {
      const token = Cookies.get('token') || null;

      await axios
        .post(
          api + '/product/mdelete',
          { ids },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(_ => {
          commit(
            'setSnackbar',
            { message: 'Successfully deleted!', type: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
  },
};

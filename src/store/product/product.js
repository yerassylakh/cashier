/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '../../router/index.js'
import { units, headers } from './ui_product.js';
const api = `https://quiet-shore-01215.herokuapp.com/product`;

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
    units,
    headers,
    isProductOpen: false,
    isProductLoading: false,
    product_id: null,
  },
  getters: {
    products: s => s.products,
    form: s => s.form,
    form_final_price: s => s.form.final_price,
    units: s => s.units,
    selected_unit: s => s.form.unit,
    headers: s => s.headers,
    isProductOpen: s => s.isProductOpen,
    isProductLoading: s => s.isProductLoading,
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
      state.form = { ...state.form, ...data }
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
    selectUnit(state, value) {
      state.units.map(el => {
        el.selected = false;
      });
      state.form.unit = value || '';
      state.units.find(el => {
        if (el.value == value) {
          el.selected = true;
        }
      })
    }
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
        limit: 10,
        merchant_id,
        stock_id
      }

      await axios
        .post(api + '/filter', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(res => {
          const products = res.data.products || [];
          commit('setProducts', products);
        })
        .catch(error => {
          console.log(error);
        })
    },
    async getProduct({ commit }, id) {
      const token = Cookies.get('token') || null;
      commit('setProductLoading', true);
      await axios
        .get(`${api}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(res => {
          const product = res.data.product || {};
          commit('setForm', product);
          commit('setProductId', product.id);
          console.log(res.data.product);
        })
        .catch(error => {
          commit('setMessage', error.response.data, { root: true })
        })
        .finally(_ => {
          commit('setProductLoading', false);
        });
    },
    async createProduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));

      const product = { ...getters.form, merchant_id, stock_id }

      await axios
        .post(api + '/', { product }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error.response.data);
        })
    },
    async deleteProduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const id = getters.product_id;

      console.log({ id });
      await axios
        .delete(`${api}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
    },
    async updateProduct({ commit, getters }) {
      const id = getters.product_id;
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));

      const product = { ...getters.form, merchant_id, stock_id }

      await axios
        .put(`${api}/${id}`, { product }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error.response.data);
        })

    },
  },
};

/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
const api = 'https://quiet-shore-01215.herokuapp.com/order';

export default {
  namespaced: true,
  state: {
    orders: [],
    isOrdersLoading: false,
    isOrderLoading: false,
    order: {},
    isOrderDialogOpen: false,
  },
  getters: {
    orders: s => s.orders || [],
    isOrdersLoading: s => s.isOrdersLoading,
    isOrderLoading: s => s.isOrderLoading,
    isOrderDialogOpen: s => s.isOrderDialogOpen,
    order: s => s.order,
  },
  mutations: {
    setOrders(state, orders) {
      state.orders = orders;
    },
    clearOrders(state) {
      state.orders = [];
    },
    setOrder(state, order) {
      state.order = order;
    },
    clearOrder(state) {
      state.order = {};
    },
    setOrderLoading(state, value) {
      state.isOrderLoading = value;
    },
    setOrdersLoading(state, value) {
      state.isOrdersLoading = value;
    },
    toggleOrderDialog(state) {
      state.isOrderDialogOpen = !state.isOrderDialogOpen;
    },
  },
  actions: {
    async getOrders({ commit }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const payload = {
        limit: 10,
        offset: 0,
        merchant_id,
        stock_id,
      };

      commit('setOrdersLoading', true);
      await axios
        .post(api + '/list', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const { orders } = res.data;
          commit('setOrders', orders);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        })
        .finally(_ => {
          commit('setOrdersLoading', false);
        });
    },
    async getOrder({ commit }, id) {
      const token = Cookies.get('token') || null;

      commit('setOrderLoading', true);
      await axios
        .get(`${api}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const { order } = res.data;
          commit('setOrder', order);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        })
        .finally(_ => {
          commit('setOrderLoading', false);
        });
    },
  },
};

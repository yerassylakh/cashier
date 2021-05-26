/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '../router/index.js';
const api = 'https://quiet-shore-01215.herokuapp.com/merch';

export default {
  namespaced: true,
  state: {
    orders: [],
  },
  getters: {},
  mutations: {},
  actions: {
    async getOrders({ commit }) {
      const payload = {
        limit: 10,
        offset: 0,
      };
    },
  },
};

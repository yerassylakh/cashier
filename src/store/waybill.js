/* eslint-disable no-unused-vars */
import axios from 'axios';
import Cookies from 'js-cookie';
const api = 'https://quiet-shore-01215.herokuapp.com';

export default {
  namespaced: true,
  state: {
    current_waybill: null,
    waybills: [],
    total_cost: 0,
    products: [],
    comment: '',
    reserved_time: new Date(),
    isWaybillOpen: false,
    status: '',
  },
  getters: {
    waybill_id: s => s.current_waybill.waybill_id,
    waybill_number: s => s.current_waybill?.number || '00000',
    current_waybill: s => s.current_waybill,
    waybills: s => s.waybills || [],
    products: s => s.products || [],
    total_cost: s => s.total_cost,
    comment: s => s.comment,
    reserved_time: s => s.reserved_time,
    isWaybillOpen: s => s.isWaybillOpen,
    status: s => s.status,
  },
  mutations: {
    setStatus(state, value) {
      state.status = value;
    },
    clearStatus(state) {
      state.status = '';
    },
    toggleWaybillDialog(state) {
      state.isWaybillOpen = !state.isWaybillOpen;
    },
    setWaybillInfo(state, value) {
      state.current_waybill = value;
    },
    clearWaybillInfo(state) {
      state.current_waybill = null;
    },
    setWaybills(state, value) {
      state.waybills = value;
    },
    clearWaybills(state) {
      state.waybills = [];
    },
    addToProducts(state, value) {
      state.products.push(value);
    },
    clearProducts(state) {
      state.products = [];
    },
    setProducts(state, products) {
      state.products = products;
    },
    updateProduct(state, product) {
      const barcode = product.barcode;

      state.products.forEach(it => {
        if (it.barcode == barcode) {
          it = barcode;
        }
      });
    },
    removeFromProducts(state, barcode) {
      const toRemove = state.products.findIndex(product => product.barcode == barcode);
      state.products.splice(toRemove, 1);
    },
    setTotalCost(state, value) {
      state.total_cost = value;
    },
    clearTotalCost(state) {
      state.total_cost = 0;
    },
    setComment(state, value) {
      state.comment = value;
    },
    clearComment(state) {
      state.commnet = '';
    },
    setReservedTime(state, date) {
      state.reserved_time = date;
    },
    clearReservedTime(state) {
      state.reserved_time = new Date();
    },
  },
  actions: {
    cleanUp({ commit }) {
      commit('clearTotalCost');
      commit('clearProducts');
      commit('clearReservedTime');
      commit('clearComment');
    },
    toggleWaybillDialog({ commit, dispatch }) {
      dispatch('cleanUp');
      commit('toggleWaybillDialog');
    },
    setWaybillData({ commit }, item) {
      const {
        status,
        comment,
        reserved_time,
        total_cost,
        id: waybill_id,
        number,
        created_on,
        updated_on,
      } = item;
      commit('setStatus', status);
      commit('setComment', comment);
      commit('setReservedTime', new Date(reserved_time));
      commit('setTotalCost', total_cost);
      commit('setWaybillInfo', { waybill_id, number, created_on, updated_on });
    },
    async conduct({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { waybill_id } = getters;

      await axios
        .get(`${api}/waybill/conduct/${waybill_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async rollback({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { waybill_id } = getters;

      await axios
        .get(`${api}/waybill/rollback/${waybill_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async getWaybillProducts({ commit }, id) {
      const token = Cookies.get('token') || null;
      const payload = {
        waybill_id: id,
        limit: 10,
        offset: 0,
      };

      await axios
        .post(api + '/waybill/product/get_list', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const { products } = res.data;
          commit('setProducts', products);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async getWaybills({ commit }, { waybill_type, document_number = '' }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const payload = {
        merchant_id,
        stock_id,
        waybill_type,
        document_number,
        limit: 1000,
        offset: 0,
      };

      await axios
        .post(api + '/waybill/filter', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          commit('setWaybills', res.data.waybills);
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async createWaybill({ commit }, type) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const waybill = {
        type,
        merchant_id,
        stock_id,
        status: 'draft',
        reserved_time: new Date()
      };

      await axios
        .post(
          api + '/waybill/create',
          { waybill },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(res => {
          const { id: waybill_id, number, created_on, updated_on } = res.data;
          commit('setWaybillInfo', { waybill_id, number, created_on, updated_on });
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async updateWaybill({ commit, getters }, { type, status = 'draft' }) {
      const token = Cookies.get('token') || null;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const { waybill_id: id, number, created_on, updated_on } = getters.current_waybill;
      const { comment, reserved_time, total_cost } = getters;
      const waybill = {
        id,
        type,
        merchant_id,
        stock_id,
        comment,
        reserved_time,
        total_cost,
        number,
        created_on,
        updated_on,
        status,
      };

      await axios
        .put(
          api + '/waybill/update',
          { waybill },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });

      console.log(waybill);
    },
    async deleteWaybill({ commit, getters }) {
      const token = Cookies.get('token') || null;
      const { waybill_id } = getters;
      await axios
        .delete(`${api}/waybill/${waybill_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async deleteProduct({ commit }, { id, barcode }) {
      const token = Cookies.get('token') || null;

      await axios
        .delete(`${api}/waybill/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          commit('setTotalCost', res.data.total_cost);
          commit('removeFromProducts', barcode);
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
    async updateProduct({ commit }, product) {
      const token = Cookies.get('token') || null;

      await axios
        .put(
          api + '/waybill/product',
          { product },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(res => {
          commit('setTotalCost', res.data.total_cost);
          commit('updateProduct', product);
          commit(
            'setSnackbar',
            { message: 'Successfully updated!', type: 'success' },
            { root: true }
          );
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
    async getProductByBarCode({ commit, getters }, barcode) {
      const token = Cookies.get('token') || null;
      const { waybill_id } = getters;
      const { merchant_id, stock_id } = JSON.parse(localStorage.getItem('stock'));
      const payload = {
        offset: 0,
        limit: 50,
        merchant_id,
        stock_id,
        name: barcode,
      };

      await axios
        .post(api + '/product/filter', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async res => {
          const [temp] = res.data.products.filter(it => it.barcode == barcode);
          const product = {
            id: null,
            name: temp.name,
            barcode: temp.barcode,
            purchase_price: temp.purchase_price,
            selling_price: temp.selling_price,
            amount: 0,
            product_id: temp.id,
            waybill_id,
          };
          await axios
            .post(
              api + '/waybill/product',
              { product },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(res2 => {
              const { total_cost, id } = res2.data;
              commit('setTotalCost', total_cost);
              Object.assign(product, { id });
              commit('addToProducts', product);
            })
            .catch(error2 => {
              commit('setSnackbar', { ...error2.response.data, type: 'error' }, { root: true });
            });
        })
        .catch(error => {
          commit('setSnackbar', { ...error.response.data, type: 'error' }, { root: true });
        });
    },
  },
};

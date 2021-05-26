import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import dateFilter from './filters/date.filter.js';
import DatetimePicker from 'vuetify-datetime-picker'

Vue.config.productionTip = false;

Vue.filter('date', dateFilter);
Vue.use(DatetimePicker);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');

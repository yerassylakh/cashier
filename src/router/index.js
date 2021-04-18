import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { layout: 'main', requiresAuth: true, requiresStock: true, },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/signin',
    name: 'Sign in',
    meta: { layout: 'default', requiresAuth: false, requiresStock: false, },
    component: () => import('@/views/Signin.vue'),
  },
  {
    path: '/stocks',
    name: 'Stocks',
    meta: { layout: 'main', requiresAuth: true, requiresStock: false, },
    component: () => import('@/views/Stocks.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresStock = to.matched.some(record => record.meta.requiresStock);
  const token = Cookies.get('token') || null;
  const stock = JSON.parse(localStorage.getItem('stock')) || null;

  if (requiresAuth) {
    if (!token) {
      return next('/signin');
      // store.commit('setMessage', { message: 'Пожалуйста войдите', type: 'default' });
    }
  }
  if (requiresStock) {
    if (!stock) {
      return next('/stocks');
    }
  }
  next();


  // await axios
  //   .post(`${window.location.origin}/api/token`, null, {
  //     headers: {
  //       Authorization: `Bearer ${jwt}`,
  //     },
  //   })
  //   .then(response => {
  //     store.commit('setUserData', response.data);
  //     return next();
  //   })
  //   .catch(error => {
  //     store.commit('setMessage', { type: 'error', message: error.response.data.message });
  //     store.commit('clearUserData');
  //     return next('/signin');
  //   });
});

export default router;

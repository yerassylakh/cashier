<template>
  <v-app>
    <component :is="layout" />
    <v-snackbar
      v-model="isSnackbarOpen"
      bottom
      right
      :color="color"
      :timeout="timeout"
      max-width="150px"
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="isSnackbarOpen = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    MainLayout,
    DefaultLayout,
  },
  data: () => ({
    isSnackbarOpen: false,
    timeout: 2000,
    message: '',
    color: '',
  }),
  created() {
    this.$store.dispatch('initApp');
  },
  mounted() {
    setInterval(async () => {
      if (this.isAuthorized) {
        await this.$store.dispatch('merch/refresh');
      }
    }, 1000 * 60)
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    },
    ...mapGetters(['snackbar']),
    ...mapGetters('merch', ['isAuthorized'])
  },
  watch: {
    snackbar(response) {
      const { status_code, message, type } = response;

      switch (type) {
        case 'error':
          this.color = 'red darken-3';
          break;
        case 'success':
          this.color = 'green lighten-1';
          break;
        default:
          this.color = '';
          break;
      }

      switch (status_code) {
        case 401:
          this.$store.dispatch('merch/logout');
          break;
        case 404:
          this.message = '404 page not found';
          break;
        default:
          break;
      }
      this.message = message;
      this.isSnackbarOpen = true;
    },
  },
  methods: {

  }
};
</script>

<style lang="scss">
#app,
.v-main {
  background-color: rgb(238, 238, 238);
}

.v-app-bar.v-app-bar--fixed {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>

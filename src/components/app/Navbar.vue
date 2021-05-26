<template>
  <v-app-bar app flat color="white" height="65">
    <v-toolbar-title class="ml-4 text-overflow">
      <router-link to="/stocks" tag="span" class="pointer-click">
        {{ stock_name }}
        <v-icon color="rgba(0, 0, 0, 0.87)">mdi-chevron-right</v-icon>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items style="position: relative">
      <v-divider vertical></v-divider>
      <v-menu v-if="merchant" bottom close-on-click transition="slide-y-transition" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" text>
            <v-icon class="mr-1">mdi-account</v-icon>
            <span>{{ merchant.name }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title> Log out </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-else text>
        <router-link to="/signin" tag="span">
          <v-icon class="mr-1">mdi-login</v-icon>
          <span>Log in</span>
        </router-link>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters('merch', ['merchant']),
    stock_name() {
      return this.$store.getters.selectedStock?.stock_name || 'Retailling outlet';
    },
  },
  methods: {
    ...mapActions('merch', ['logout']),
  },
};
</script>

<style lang="scss">
.pointer-click {
  cursor: pointer;
}
.text-overflow {
  text-overflow: initial !important;
}
</style>

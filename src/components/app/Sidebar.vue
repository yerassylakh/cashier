<template>
  <v-navigation-drawer permanent app fixed :mini-variant="mini">
    <v-list height="64">
      <v-list-item>
        <v-list-item-icon class="mr-4">
          <v-img
            :aspect-ratio="4 / 3"
            max-height="40"
            max-width="40"
            contain
            src="@/assets/images/logo.svg"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">Cashier</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list dense nav>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="item in items" :key="item.title" link exact :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
              <!-- <router-link :to="item.to" tag="span">{{ item.title }}</router-link> -->
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: 'Products', icon: 'mdi-shopping-outline', to: '/' },
      { title: 'Sales', icon: 'mdi-sale', to: '/sales' },
      { title: 'Write-off of goods', icon: 'mdi-checkbook', to: '/write-off' },
      { title: 'Acceptance of goods', icon: 'mdi-comment-check-outline', to: '/acceptance' },
    ],
    selectedItem: 1,
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
};
</script>

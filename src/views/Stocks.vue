<template>
  <div class="d-flex">
    <v-progress-circular
      v-if="isLoading"
      :size="100"
      color="primary"
      class="mx-auto"
      indeterminate
    ></v-progress-circular>
    <v-row v-else>
      <v-col v-for="item in stocks" :key="item.id" cols="3">
        <v-card height="100%">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-icon class="mx-auto">
                <v-icon class="mx-auto" x-large> mdi-point-of-sale </v-icon>
              </v-list-item-icon>
              <v-list-item-title class="headline font-weight-bold mb-1 text-center h5">
                {{ item.stock_name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions class="my-5">
            <v-btn
              class="mx-auto"
              width="50%"
              filled
              rounded
              color="#6187EE"
              dark
              @click="choose(item)"
            >
              Choose
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    isLoading: true,
  }),
  methods: {
    choose(item) {
      this.$store.commit('setStock', item);
      this.$router.push('/');
    },
  },
  computed: {
    ...mapGetters(['stocks']),
  },
  async mounted() {
    await this.$store.dispatch('getStocks');
    this.isLoading = false;
  },
  destroyed() {
    this.$store.commit('clearStocks');
  },
};
</script>

<style></style>

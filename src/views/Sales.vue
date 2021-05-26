<template>
  <div>
    <v-sheet color="transparent mb-5">
      <v-row>
        <v-col cols="2">
          <v-text-field
            v-model="search"
            label="Search"
            outlined
            background-color="white"
            append-icon="mdi-magnify"
            color="#6187ee"
            hide-details
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </v-sheet>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="orders"
      :items-per-page="10"
      :search="search"
      item-key="id"
      :loading="isOrdersLoading"
    >
      <template v-slot:[`item.timestamp`]="{ item }">
        <span>{{ item.timestamp | date }}</span>
      </template>
      <template v-slot:[`item.open`]="{ item }">
        <v-icon @click="openOrder(item.id)">mdi-open-in-new</v-icon>
      </template>
    </v-data-table>
    <order-dialog />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderDialog from '@/components/order/OrderDialog';

export default {
  name: 'WriteOff_of_goods',
  components: { OrderDialog },
  data: () => ({
    search: '',
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Total sum', value: 'total_sum' },
      { text: 'Date and time', value: 'timestamp' },
      { text: 'Cash box', value: 'cash_box_id' },
      { text: 'Pay type', value: 'pay_type' },
      { text: 'Open', value: 'open' },
    ],
  }),
  computed: {
    ...mapGetters('order', ['orders', 'order', 'isOrderLoading', 'isOrdersLoading']),
  },
  methods: {
    async openOrder(id) {
      this.$store.commit('order/toggleOrderDialog');
      await this.$store.dispatch('order/getOrder', id);
    },
  },
  async mounted() {
    await this.$store.dispatch('order/getOrders');
  },
  beforeDestroy() {
    this.$store.commit('order/clearOrders');
  },
};
</script>

<style lang="scss">
.data-controls {
  background: #fff;
  margin-bottom: 1em;
  border-radius: 4px;
  &__container {
    padding: 1em;
  }

  &__row {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    margin: 0.75em;
  }
}
</style>

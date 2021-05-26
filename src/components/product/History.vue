<template>
  <v-data-table
    :headers="headers"
    :items="history"
    :items-per-page="5"
    class="elevation-1 mb-5"
    :loading="isHistoryLoading"
  >
    <template v-slot:[`item.Timestamp`]="{ item }">
      <span>{{ item.Timestamp | date }}</span>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data: () => ({
    headers: [
      { text: 'Reason', value: 'reason' },
      { text: 'Date and time', value: 'Timestamp' },
      { text: 'Amount', value: 'amount' },
      { text: 'Selling price', value: 'selling_price' },
      { text: 'Purchase price', value: 'purchase_price' },
      { text: 'Source', value: 'source' },
    ],
  }),
  computed: {
    ...mapGetters('product', ['isHistoryLoading', 'history']),
  },
};
</script>

<style></style>

<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="barcode"
          append-icon="mdi-magnify"
          outlined
          dense
          hide-details="false"
          @click:append="searchBarcode"
          @keydown.enter="searchBarcode"
          :loading="barcodeLoading"
          label="Barcode"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      class="mt-4"
      :headers="headers"
      :items="products"
      :loading="isProductLoading"
      v-model="selected"
      item-key="barcode"
      show-select
    >
      <template v-slot:[`item.amount`]="{ item }">
        <v-text-field
          v-model.number="item.amount"
          outlined
          dense
          hide-details="false"
          @blur="updateProduct(item)"
        ></v-text-field>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-icon @click="deleteProduct(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: ['isProductLoading'],
  data: () => ({
    barcode: '',
    barcodeLoading: false,
    selected: [],
    headers: [
      { text: 'BARCODE', value: 'barcode' },
      { text: 'NAME', value: 'name' },
      { text: 'AMOUNT', value: 'amount' },
      { text: 'PURCHASE PRICE', value: 'purchase_price' },
      { text: 'SELLING PRICE', value: 'selling_price' },
      { text: 'ACTION', value: 'action' },
    ],
  }),
  computed: {
    ...mapGetters('waybill', ['products']),
  },
  methods: {
    async searchBarcode() {
      this.barcodeLoading = true;
      await this.$store.dispatch('waybill/getProductByBarCode', this.barcode);
      this.barcode = '';
      this.barcodeLoading = false;
    },
    async deleteProduct(item) {
      await this.$store.dispatch('waybill/deleteProduct', { id: item.id, barcode: item.barcode });
    },
    async updateProduct(item) {
      await this.$store.dispatch('waybill/updateProduct', item);
    },
  },
};
</script>

<style></style>

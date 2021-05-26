<template>
  <v-dialog
    v-model="isOrderDialogOpen"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="closeDialog()"
  >
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title> Order info </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <div class="mt-4">
          <v-sheet class="create__container mt-5">
            <v-subheader class="pl-0">Orders</v-subheader>
            <v-data-table
              class="elevation-1"
              :headers="headers"
              :items="order.order_items"
              :items-per-page="10"
              item-key="id"
              :loading="isOrderLoading"
            >
            </v-data-table>
          </v-sheet>
        </div>
      </v-container>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-spacer></v-spacer>
        <v-btn outlined color="#6187EE" @click="closeDialog()">Close</v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data: () => ({
    headers: [
      { text: 'ID', value: 'product_id' },
      { text: 'BARCODE', value: 'barcode' },
      { text: 'Name', value: 'name' },
      { text: 'Purchase price', value: 'purchase_price' },
      { text: 'Selling price', value: 'selling_price' },
      { text: 'Amount', value: 'amount' },
    ],
  }),
  computed: {
    ...mapGetters('order', ['isOrderDialogOpen', 'isOrderLoading', 'order']),
  },
  methods: {
    ...mapMutations('order', ['toggleOrderDialog', 'clearOrder']),
    closeDialog() {
      this.toggleOrderDialog();
      this.clearOrder();
    },
  },
  beforeDestroy() {
    this.clearOrder();
  },
};
</script>

<style lang="scss">
.dialog {
  &__container {
    height: 100%;
    padding: 1.5em 2em;
  }

  &__form {
    margin-top: 1em;
    border-radius: 5px;
  }
}
.create__container {
  padding: 1.5em;
  border-radius: 5px;
}
</style>

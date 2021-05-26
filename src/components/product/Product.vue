<template>
  <v-dialog
    v-model="isProductOpen"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="toggleProduct"
  >
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title>Product</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleProduct">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="dialog__container">
        <v-tabs v-model="tab" background-color="transparent">
          <v-tab :ripple="false"> General Information </v-tab>
          <v-tab :ripple="false"> History </v-tab>
        </v-tabs>
        <v-divider class="mt-3"></v-divider>
        <v-tabs-items v-model="tab" class="dialog__component">
          <v-tab-item>
            <Form :readonly="true" :isProductLoading="isProductLoading" />
          </v-tab-item>
          <v-tab-item>
            <History :isProductLoading="isProductLoading" />
          </v-tab-item>
        </v-tabs-items>
      </div>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-spacer></v-spacer>
        <v-btn filled color="red darken-3" dark @click="deleteProduct" :loading="loading_delete">
          Delete product
        </v-btn>
        <v-btn
          filled
          color="#6187EE"
          dark
          @click="saveProduct"
          class="ml-3"
          :loading="loading_update"
        >
          Save
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import Form from '@/components/product/Form.vue';
import History from '@/components/product/History.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { Form, History },
  data: () => ({
    loading_delete: false,
    loading_update: false,
    tab: 0,
  }),
  computed: {
    ...mapGetters('product', ['isProductOpen', 'isProductLoading']),
  },
  methods: {
    ...mapActions('product', ['toggleProduct']),
    async saveProduct() {
      this.loading_update = true;
      await this.$store.dispatch('product/updateProduct');
      await this.$store.dispatch('product/getProducts');
      this.loading_update = false;
      this.toggleProduct();
    },
    async deleteProduct() {
      this.loading_delete = true;
      await this.$store.dispatch('product/deleteProduct');
      await this.$store.dispatch('product/getProducts');
      this.loading_delete = false;
      this.toggleProduct();
    },
  },
};
</script>

<style lang="scss">
.dialog {
  &__container {
    height: 100%;
    padding: 1.5em 2em;
  }

  &__component {
    margin-top: 1em;
    background: transparent !important;
  }
}
</style>

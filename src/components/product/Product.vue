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
        <v-subheader>General Information</v-subheader>
        <v-divider></v-divider>
        <v-progress-circular
          v-if="isProductLoading"
          :size="100"
          color="primary"
          class="mx-auto"
          indeterminate
        ></v-progress-circular>
        <div v-else class="dialog__form">
          <Form />
        </div>
      </div>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-spacer></v-spacer>
        <v-btn filled color="#6187EE" dark @click="deleteProduct"> Delete product </v-btn>
        <v-btn filled color="#6187EE" dark @click="saveProduct" class="ml-3"> Save </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import Form from '@/components/product/Form.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: { Form },
  computed: {
    ...mapGetters('product', ['isProductOpen', 'isProductLoading']),
  },
  methods: {
    ...mapActions('product', ['toggleProduct']),
    async saveProduct() {
      await this.$store.dispatch('product/updateProduct');
      this.toggleProduct();
    },
    async deleteProduct() {
      await this.$store.dispatch('product/deleteProduct');
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

  &__form {
    margin-top: 1em;
  }
}
</style>

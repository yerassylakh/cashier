<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn filled border-radius color="#6187EE" dark v-bind="attrs" v-on="on">
        Create a product
      </v-btn>
    </template>
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title>Create a product</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="dialog__container">
        <v-subheader>General Information</v-subheader>
        <v-divider></v-divider>
        <div class="dialog__form">
          <Form />
        </div>
      </div>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-spacer></v-spacer>
        <v-btn outlined color="#6187EE" @click="clear"> Clear </v-btn>
        <v-btn filled color="#6187EE" dark class="ml-3" @click="create" :loading="isLoadingCreate"> Create a product </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import Form from '@/components/product/Form.vue';

export default {
  components: { Form },
  data: () => ({
    dialog: false,
    isLoadingCreate: false,
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
      // clear form data
    },
    async create() {
      this.isLoadingCreate = true;
      await this.$store.dispatch('product/createProduct');
      await this.$store.dispatch('product/getProducts');
      this.isLoadingCreate = false;
      this.dialog = false;
      // if no error close dialog and clear
    },
    clear() {
      this.$store.commit('product/clearForm');
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

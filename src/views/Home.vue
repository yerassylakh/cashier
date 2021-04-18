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
    <v-sheet class="data-controls">
      <div class="data-controls__container">
        <v-row>
          <div class="data-controls__button">
            <create-dialog />
          </div>
          <div class="data-controls__button">
            <downloadCsv :data="selected">
              <v-btn text outlined color="#6187ee" :disabled="selected.length > 0 ? false : true">Export as CSV</v-btn>
            </downloadCsv>
          </div>
          <div class="data-controls__button">
            <v-btn text outlined color="#6187ee" :disabled="selected.length > 0 ? false : true">Удалить</v-btn>
          </div>
        </v-row>
      </div>
    </v-sheet>
    <v-data-table
      class="elevation-1"
      v-model="selected"
      :loading="isLoading"
      :headers="headers"
      :items="products"
      :items-per-page="10"
      :search="search"
      item-key="name"
      show-select
    >
      <template v-slot:[`item.extra_price`]="{ item }">
        <span v-text="extra_price(item.purchase_price, item.selling_price)"></span>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <a v-text="item.name" @click="openProduct(item.id)"></a>
      </template>
    </v-data-table>
    <ProductDialog/>
  </div>
</template>

<script>
import CreateDialog from '@/components/product/Create.vue';
import ProductDialog from '@/components/product/Product.vue';
import JsonCSV from 'vue-json-csv';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    CreateDialog,
    ProductDialog,
    downloadCsv: JsonCSV,
  },
  data: () => ({
    isLoading: true,
    dialog: false,
    selected: [],
    search: '',
  }),
  computed: {
    ...mapGetters('product', ['products', 'headers']),
  },
  async mounted() {
    await this.$store.dispatch('product/getProducts');
    this.isLoading = false;
    await this.$store.commit('setSnackbar', { message: 'Hello', type: 'success' })
  },
  methods: {
    extra_price(purchase_price, selling_price) {
      if (purchase_price && selling_price) {
        return ((selling_price - purchase_price) / purchase_price) * 100 + '%';
      }
      return 0;
    },
    async openProduct(id) {
      this.$store.dispatch('product/toggleProduct')
      await this.$store.dispatch('product/getProduct', id);
    },
  },
  destroyed() {
    this.$store.commit('product/clearProducts');
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

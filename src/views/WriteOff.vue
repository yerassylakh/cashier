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
            <create-waybill :type="type" title="Write Off" />
          </div>
        </v-row>
      </div>
    </v-sheet>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="waybills"
      :items-per-page="10"
      :search="search"
      item-key="id"
      :loading="isLoading"
    >
      <template v-slot:[`item.reserved_time`]="{ item }">
        <span>{{ item.reserved_time | date }}</span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getColor(item.status)" dark>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.open`]="{ item }">
        <v-icon @click="openWaybill(item)">mdi-open-in-new</v-icon>
      </template>
    </v-data-table>
    <waybill-dialog
      :type="type"
      title="Write Off"
      :isProductLoading="isProductLoading"
    ></waybill-dialog>
  </div>
</template>

<script>
import CreateWaybill from '@/components/waybill/CreateWaybill.vue';
import WaybillDialog from '@/components/waybill/WaybillDialog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'WriteOff_of_goods',
  components: {
    WaybillDialog,
    CreateWaybill,
  },
  data: () => ({
    isLoading: false,
    isProductLoading: false,
    search: '',
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'Comment', value: 'comment' },
      { text: 'Total cost', value: 'total_cost' },
      { text: 'Reserved', value: 'reserved_time' },
      { text: 'Status', value: 'status' },
      { text: 'Open', value: 'open' },
    ],
    type: 'outwaybill',
  }),
  computed: {
    ...mapGetters('waybill', ['waybills']),
  },
  methods: {
    getColor(status) {
      return status.toLowerCase() == 'draft' ? 'orange' : 'green';
    },
    async openWaybill(item) {
      this.$store.dispatch('waybill/toggleWaybillDialog');
      this.$store.dispatch('waybill/setWaybillData', item);
      this.isProductLoading = true;
      await this.$store.dispatch('waybill/getWaybillProducts', item.id);
      this.isProductLoading = false;
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
    this.isLoading = false;
  },
  beforeDestroy() {
    this.$store.commit('waybill/clearWaybills');
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

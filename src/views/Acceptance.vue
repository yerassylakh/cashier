<template>
  <div>
    <v-sheet color="transparent mb-5">
      <v-row>
        <v-col cols="5">
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
            <CreateAcceptance />
          </div>
          <div class="data-controls__button">
            <v-btn
              text
              outlined
              color="#6187ee"
              :disabled="selected.length > 0 ? false : true"
              v-text="'DELETE'"
            >
            </v-btn>
          </div>
        </v-row>
      </div>
    </v-sheet>
    <v-data-table
      class="elevation-1"
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :search="search"
      item-key="id"
      show-select
      v-model="selected"
      dense
    >
      <template v-slot:[`item.status`]="{ item }">
        <span>
          {{ item.status }}
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CreateAcceptance from '@/components/acceptance/CreateAcceptance.vue';

export default {
  name: 'Acceptance',
  components: {
    CreateAcceptance,
  },
  data: () => ({
    isLoading: false,
    search: '',
    selected: [],
    headers: [
      { text: 'Number', value: 'number' },
      { text: 'The supplier', value: 'supplier' },
      { text: 'Recipient', value: 'recipient' },
      { text: 'Invoice source', value: 'invoice_source' },
      { text: 'Total sum', value: 'total_sum' },
      { text: 'Paid', value: 'paid' },
      { text: 'Remains', value: 'remain' },
      { text: 'Date and time', value: 'date' },
      { text: 'Status', value: 'status' },
    ],
    items: [
      {
        id: 1,
        number: '',
        supplier: 'GregorySupplier',
        recipient: 'Artem',
        invoice_source: 'Outlet',
        total_sum: '130 T',
        paid: '130 T',
        remain: '0 T',
        date: '05.05.2021, 22:40',
        status: 'Draft',
      },
      {
        id: 2,
        number: '',
        supplier: 'GregorySupplier',
        recipient: 'Artem',
        invoice_source: 'Outlet',
        total_sum: '160 T',
        paid: '160 T',
        remain: '0 T',
        date: '06.05.2021, 11:40',
        status: 'Completed',
      },
      {
        id: 3,
        number: '',
        supplier: 'GregorySupplier',
        recipient: 'Artem',
        invoice_source: 'Outlet',
        total_sum: '160 T',
        paid: '160 T',
        remain: '0 T',
        date: '06.05.2021, 11:40',
        status: 'Completed',
      },
      {
        id: 4,
        number: '',
        supplier: 'GregorySupplier',
        recipient: 'Artem',
        invoice_source: 'Outlet',
        total_sum: '160 T',
        paid: '160 T',
        remain: '0 T',
        date: '06.05.2021, 11:40',
        status: 'Completed',
      },
    ],
  }),
  methods: {
    getColor(status) {
      return status.toLowerCase() == 'draft' ? 'orange' : 'green';
    },
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

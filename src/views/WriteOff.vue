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
            <CreateWriteOff />
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
    >
    <template v-slot:[`item.status`]="{ item }">
      <v-chip
        :color="getColor(item.status)"
        dark
      >
        {{ item.status }}
      </v-chip>
    </template>
    </v-data-table>
  </div>
</template>

<script>
import CreateWriteOff from '@/components/write_off/CreateWriteOff.vue';

export default {
  name: 'WriteOff_of_goods',
  components: {
    CreateWriteOff,
  },
  data: () => ({
    isLoading: false,
    search: '',
    headers: [
      { text: 'Employee', value: 'employee' },
      { text: 'Comment', value: 'comment' },
      { text: 'Warehouse', value: 'warehouse' },
      { text: 'Total sum', value: 'total_sum' },
      { text: 'Date and time', value: 'date' },
      { text: 'Status', value: 'status' },
    ],
    items: [
      {
        id: 1,
        employee: 'Arnur',
        comment: '',
        warehouse: 'Warehouse',
        total_sum: '',
        date: '08.05.2021 06:32',
        status: 'Draft',
      },
      {
        id: 2,
        employee: 'Arnur',
        comment: '',
        warehouse: 'Warehouse',
        total_sum: '',
        date: '08.05.2021 06:32',
        status: 'Active',
      },
    ],
  }),
  methods: {
    getColor(status) {
      return status.toLowerCase() == 'draft' ? 'orange' : 'green';
    }
  }
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

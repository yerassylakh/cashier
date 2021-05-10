<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
</template>

<script>
export default {
  data: () => ({
    headers: [
      { text: 'Action', value: 'action' },
      { text: 'Date', value: 'date' },
      { text: 'Employee', value: 'employee' },
      { text: 'Amount before', value: 'amount_before' },
      { text: 'Amount after', value: 'amount_after' },
      { text: 'Difference', value: 'difference' },
    ],
    items: [
      {
        action: 'Price change',
        date: '08.05.2021 06:32',
        employee: 'Arnur',
        amount_before: 50,
        amount_after: 50,
        difference: 0,
      },
      {
        action: 'Price change',
        date: '04.05.2021 16:22',
        employee: 'Arnur',
        amount_before: 50,
        amount_after: 50,
        difference: 0,
      },
      {
        action: 'Accept',
        date: '23.04.2021 11:25',
        employee: 'Arnur',
        amount_before: 50,
        amount_after: 50,
        difference: 0,
      },
    ],
  }),
};
</script>

<style></style>

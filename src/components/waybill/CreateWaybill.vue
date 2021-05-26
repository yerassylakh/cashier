<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="closeDialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        filled
        border-radius
        color="#6187EE"
        dark
        v-bind="attrs"
        v-on="on"
        @click="createWayBill"
      >
        Create a {{ title }}
      </v-btn>
    </template>
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title
          >Create a {{ title }} <b>#{{ waybill_number }}</b></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <div class="mt-4">
          <v-sheet class="create__container">
            <v-subheader class="pl-0">General information</v-subheader>
            <v-row class="mt-5">
              <v-col cols="12" md="3">
                <v-text-field
                  :value="merchant.name"
                  label="Employee"
                  readonly
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  :value="new Date() | date"
                  :label="'Date of creation ' + title"
                  readonly
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-datetime-picker
                  label="Select Reserved Datetime"
                  v-model="reserved_time"
                  dateFormat="dd.MM.yyyy"
                  hide-details="false"
                  :dialogWidth="500"
                >
                  <template slot="dateIcon">
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                  <template slot="timeIcon">
                    <v-icon>mdi-clock</v-icon>
                  </template>
                </v-datetime-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field v-model="comment" label="Comment" dense></v-text-field>
              </v-col>
            </v-row>
          </v-sheet>
          <v-sheet class="create__container mt-5">
            <v-subheader class="pl-0">Products for {{ title }}</v-subheader>
            <waybill-table></waybill-table>
          </v-sheet>
        </div>
      </v-container>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-toolbar-title>Total cost: {{ Number(total_cost).toLocaleString() }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outlined color="#6187EE" @click="closeDialog()">Cancel</v-btn>
        <v-btn filled color="#6187EE" dark class="ml-3" @click="saveAsDraft">Save as draft</v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import waybill_table from '@/components/waybill/Table.vue';

export default {
  components: { 'waybill-table': waybill_table },
  props: ['type', 'title'],
  data: () => ({
    dialog: false,
    isLoadingCreate: false,
    comment: '',
    reserved_time: new Date(),
  }),
  computed: {
    ...mapGetters('merch', ['merchant']),
    ...mapGetters('waybill', ['total_cost', 'waybill_number']),
  },
  methods: {
    async closeDialog() {
      const answer = confirm('Close and delete?');
      if (answer) {
        this.dialog = false;
        await this.$store.dispatch('waybill/deleteWaybill');
        await this.$store.dispatch('waybill/cleanUp');
      }
    },
    async saveAsDraft() {
      this.$store.commit('waybill/setReservedTime', this.reserved_time);
      this.$store.commit('waybill/setComment', this.comment);
      await this.$store.dispatch('waybill/updateWaybill', { type: this.type, status: 'draft' });
      await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
      this.dialog = false;
    },
    async createWayBill() {
      await this.$store.dispatch('waybill/createWaybill', 'outwaybill');
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
    border-radius: 5px;
  }
}
.create__container {
  padding: 1.5em;
  border-radius: 5px;
}
</style>

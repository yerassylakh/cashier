<template>
  <v-dialog
    v-model="isWaybillOpen"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="toggleWaybillDialog"
  >
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title>
          {{ title }}
          <b>#{{ waybill_number }}</b>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleWaybillDialog()">
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
                  :label="'Date of creation' + title"
                  readonly
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-datetime-picker
                  label="Select Reserved Datetime"
                  v-model="reserved_time_local"
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
                <v-text-field v-model="comment_local" label="Comment" dense></v-text-field>
              </v-col>
            </v-row>
          </v-sheet>
          <v-sheet class="create__container mt-5">
            <v-subheader class="pl-0">Products for {{ title }}</v-subheader>
            <waybill-table :isProductLoading="isProductLoading"></waybill-table>
          </v-sheet>
        </div>
      </v-container>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-toolbar-title>Total cost: {{ Number(total_cost).toLocaleString() }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn outlined color="#6187EE" @click="toggleWaybillDialog()">Cancel</v-btn>
        <v-btn filled color="red darken-3" dark class="ml-3" @click="deleteW">Delete</v-btn>
        <v-btn filled color="#6187EE" dark class="ml-3" @click="updateWaybill">Update</v-btn>
        <v-btn v-if="status == 'draft'" filled color="#6187EE" dark class="ml-3" @click="conduct">
          Conduct
        </v-btn>
        <v-btn
          v-else-if="status == 'active'"
          filled
          color="#6187EE"
          dark
          class="ml-3"
          @click="rollback"
        >
          Rollback
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import waybill_table from '@/components/waybill/Table.vue';

export default {
  components: { 'waybill-table': waybill_table },
  props: ['type', 'title', 'isProductLoading'],
  data: () => ({
    isLoadingCreate: false,
    comment_local: '',
    reserved_time_local: new Date(),
  }),
  computed: {
    ...mapGetters('merch', ['merchant']),
    ...mapGetters('waybill', [
      'total_cost',
      'waybill_number',
      'status',
      'isWaybillOpen',
      'comment',
      'reserved_time',
    ]),
  },
  watch: {
    isWaybillOpen() {
      this.setLocalData();
    }
  },
  beforeDestroy() {
    this.toggleWaybillDialog();
  },
  methods: {
    ...mapActions('waybill', ['toggleWaybillDialog', 'deleteWaybill']),
    async updateWaybill() {
      this.$store.commit('waybill/setReservedTime', this.reserved_time_local);
      this.$store.commit('waybill/setComment', this.comment_local);
      await this.$store.dispatch('waybill/updateWaybill', { type: this.type, status: this.status });
      await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
      this.toggleWaybillDialog();
    },
    async deleteW() {
      await this.deleteWaybill();
      await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
      this.toggleWaybillDialog();
    },
    async conduct() {
      await this.$store.dispatch('waybill/conduct');
      await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
      this.toggleWaybillDialog();
    },
    async rollback() {
      await this.$store.dispatch('waybill/rollback');
      await this.$store.dispatch('waybill/getWaybills', { waybill_type: this.type });
      this.toggleWaybillDialog();
    },
    setLocalData() {
      console.log('Set');
      if (this.comment && this.reserved_time) {
        this.comment_local = this.comment;
        this.reserved_time_local = this.reserved_time;
      }
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

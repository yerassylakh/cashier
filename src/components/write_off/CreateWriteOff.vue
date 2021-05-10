<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn filled border-radius color="#6187EE" dark v-bind="attrs" v-on="on">
        Create a write-off
      </v-btn>
    </template>
    <v-card color="rgb(238, 238, 238)" scrollable>
      <v-toolbar>
        <v-toolbar-title>Create a write-off</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <div class="mt-4">
          <v-sheet class="create__container">
            <v-subheader>General information</v-subheader>
            <v-row class="mt-5">
              <v-col cols="12" md="3">
                <v-text-field
                  :value="merchant.name"
                  label="Employee"
                  readonly
                  outlined
                  disabled
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  :value="new Date().toLocaleDateString()"
                  label="Date of creation writeoff"
                  readonly
                  outlined
                  disabled
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="actual_date"
                  label="Actual write-off date"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field label="Comment" outlined dense>
                </v-text-field>
              </v-col>
            </v-row>
          </v-sheet>
          <v-sheet class="create__container mt-5">
            <v-subheader>Products for write-off</v-subheader>
          </v-sheet>
        </div>
      </v-container>
      <v-toolbar absolute bottom width="100%" class="mt-5">
        <v-spacer></v-spacer>
        <v-btn outlined color="#6187EE" @click="clear"> Cancel </v-btn>
        <v-btn filled color="red darken-3" dark class="ml-3" @click="saveAsDraft">
          Save as draft
        </v-btn>
        <v-btn filled color="#6187EE" dark class="ml-3" @click="create" :loading="isLoadingCreate">
          Write Off
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data: () => ({
    dialog: false,
    isLoadingCreate: false,
    actual_date: new Date().toLocaleString(),
  }),
  computed: {
    ...mapGetters('merch', ['merchant']),
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      // clear form data
    },
    async create() {

    },
    saveAsDraft() {

    },
    clear() {

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

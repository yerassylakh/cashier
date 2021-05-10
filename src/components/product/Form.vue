<template>
  <div class="product-form">
    <div class="product-form__container">
      <form class="product-form__form">
        <span class="product-form__label">Barcode</span>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="form.barcode"
              outlined
              dense
              :error-messages="barcodeError"
              @blur="$v.form.barcode.$touch()"
              :loading="isProductLoading"
            ></v-text-field>
            <barcode v-if="form.barcode" :value="form.barcode"></barcode>
          </v-col>
        </v-row>
        <span class="product-form__label">Name</span>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="form.name"
              outlined
              dense
              :error-messages="nameError"
              @blur="$v.form.name.$touch()"
              :loading="isProductLoading"
            ></v-text-field>
          </v-col>
        </v-row>
        <span class="product-form__label">Unit of measurement</span>
        <v-chip-group>
          <v-chip
            v-for="unit in units"
            :key="unit.value"
            label
            outlined
            v-text="unit.value"
            :class="selected_unit == unit.value ? 'v-chip--selected' : ''"
            :loading="isProductLoading"
            @click="selectUnit(unit.value)"
          ></v-chip>
        </v-chip-group>
        <span class="product-form__label">Price</span>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model.number="form.purchase_price"
              suffix="Т"
              outlined
              dense
              label="Cost price"
              :loading="isProductLoading"
              hide-details="false"
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-plus</v-icon>
          <v-col cols="3">
            <v-text-field
              :value="price_extra"
              suffix="%"
              outlined
              dense
              readonly
              :loading="isProductLoading"
              label="Extra price"
              hide-details="false"
            ></v-text-field>
          </v-col>
          <v-icon small>mdi-equal</v-icon>
          <v-col cols="4">
            <v-text-field
              v-model.number="form.selling_price"
              suffix="Т"
              outlined
              dense
              label="Sale price"
              :loading="isProductLoading"
              hide-details="false"
            ></v-text-field>
          </v-col>
        </v-row>
        <span class="product-form__label">Amount</span>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model.number="form.amount"
              outlined
              dense
              placeholder="0"
              hide-details="false"
              :loading="isProductLoading"
              :readonly="readonly"
              :disabled="readonly"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="6">
            <v-select :items="categories" label="Categories" outlined dense></v-select>
          </v-col>
        </v-row> -->
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import VueBarcode from 'vue-barcode';
import { validationMixin } from 'vuelidate';
import { required, decimal } from 'vuelidate/lib/validators';

export default {
  data: () => ({}),
  props: ['readonly', 'isProductLoading'],
  mixins: [validationMixin],
  validations: {
    form: {
      name: { required },
      barcode: { required, decimal },
      unit: { required },
    },
  },
  components: { barcode: VueBarcode },
  computed: {
    ...mapGetters('product', ['form', 'form_final_price', 'units', 'selected_unit', 'categories']),
    price_extra() {
      const { purchase_price, selling_price } = this.form;
      if (purchase_price && selling_price) {
        return ((selling_price - purchase_price) / purchase_price) * 100;
      }
      return 0;
    },
    nameError() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required && errors.push('Name is required');
      return errors;
    },
    barcodeError() {
      const errors = [];
      if (!this.$v.form.barcode.$dirty) return errors;
      !this.$v.form.barcode.required && errors.push('Barcode is required');
      !this.$v.form.barcode.decimal && errors.push('Only numbers');
      return errors;
    },
  },
  methods: {
    ...mapMutations('product', ['selectUnit']),
  },
};
</script>

<style lang="scss">
.product-form {
  background: #fff;
  width: 100%;
  &__container {
    padding: 1.5em;
    width: 100%;
    height: 100%;
    margin-bottom: 5em;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__label {
    color: #555;
  }

  &__label:not(:first-child) {
    margin-top: 1em;
  }
}

.v-chip.v-chip--outlined.v-chip.v-chip.v-chip--selected {
  border-color: #6187ee;
  background: rgb(238, 238, 238) !important;
}
</style>

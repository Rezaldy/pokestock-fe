<template>
  <q-page class="row items-start justify-start q-pa-xl">
    <q-btn @click="$router.push({name: 'shopCategories'})" color="primary" icon="arrow_left">
      <q-tooltip
        transition-show="scale"
        transition-hide="scale"
        anchor="top middle"
        self="bottom middle">
        Back to shop categories
      </q-tooltip>
    </q-btn>
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Shop
      </q-toolbar-title>
      <q-btn round @click="showShoppingCart" flat color="white" icon="local_grocery_store" class="q-mr-sm">
        <q-badge color="red" floating>{{ $store.getters['shop/getCartSize'] }}</q-badge>
      </q-btn>
      <q-dialog
        v-model="shoppingCartState" persistent
      >
        <q-card style="width: 700px; max-width: 80vw;">

          <q-inner-loading :showing="shoppingCartLoadingState">
            <q-spinner-gears size="50px" color="primary"/>
          </q-inner-loading>
          <q-card-section>
            <div class="text-h5">Shopping cart</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div>
              <div v-if="Object.keys($store.getters['shop/getCart']).length">
                <q-list bordered separator>
                  <q-item v-ripple v-for="cartItem in $store.getters['shop/getCart']" :key="cartItem.order.id">
                    <q-item-section class="col-1">
                      <q-item-section avatar>
                        <q-avatar color="primary" rounded text-color="white">
                          <q-img :src="cartItem.product.image"/>
                        </q-avatar>
                      </q-item-section>
                    </q-item-section>
                    <q-item-section class="col-9 no-margin">
                      <q-item-label>{{ cartItem.product.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-2 text-right">
                      <q-item-label class="text-bold">${{ cartItem.order.price * cartItem.quantity }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="col-10">
                      <q-item-label>Total</q-item-label>
                    </q-item-section>
                    <q-item-section class="col-2 text-right">
                      <q-item-label class="text-bold text-positive">${{ cartTotal }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div class="text-h6 q-mt-lg">
                  Additional information
                </div>
                <q-separator/>
                <q-toggle v-model="additionalData.includeCodes" checked-icon="check" color="secondary"
                          unchecked-icon="clear" label="Include codes"/>
                <q-toggle v-model="additionalData.includeBulk" checked-icon="check" color="secondary"
                          unchecked-icon="clear" label="Include bulk"/>
                <q-slide-transition appear>
                  <q-input v-if="additionalData.includeBulk"
                           v-model="additionalData.bulkSpecifics"
                           filled
                           autogrow
                           label="What would you like to keep?"
                  />
                </q-slide-transition>
                <q-input
                  class="q-mt-sm"
                  v-model="additionalData.futurePackRequests"
                  filled
                  autogrow
                  label="If there are packs you want to buy that we dont have, let us know what they are!"
                />
              </div>
              <div v-else>
                Your shopping cart is empty.
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Close" v-close-popup/>
            <q-btn @click="clearShoppingCart" flat label="Clear"/>
            <q-btn @click="submitOrder" flat label="Submit order">
              <q-tooltip
                v-if="!$store.getters['auth/user'].discord_nickname"
                transition-show="scale"
                transition-hide="scale"
                anchor="top middle"
                self="bottom middle"
                content-class="bg-warning text-black text-bold"
              >
                Connect your discord before submitting orders! Click on your name in the top right to do so.
              </q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-toolbar>
    <!-- Orderform start -->
    <q-dialog
      v-model="orderFormState"
      @hide="order.selectedListing = {};order.selectedProduct = {}"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-inner-loading :showing="orderFormLoadingState">
          <q-spinner-gears size="50px" color="primary"/>
        </q-inner-loading>
        <q-card-section>
          <div class="text-h5">Add item to cart</div>
        </q-card-section>
        <q-separator/>
        <q-item-section class="q-pa-md">
          <q-slide-transition appear>
            <q-item-label v-if="!Object.keys(order.selectedListing).length">
              <div class="text-h6">Select a price listing:</div>
              <div class="row q-gutter-xs">
                <q-btn
                  @click="setSelectedListing(listing)" class="text-center" :key="listing.id"
                  v-for="listing in getAvailableListings(order.selectedProduct.product_listings)"
                  :color="listing.isDiscount ? 'positive' : 'secondary'">
                  {{ listing.amount }}x${{ (listing.price / listing.amount).toFixed(2) }}
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    anchor="top middle"
                    self="bottom middle"
                  >
                    Total ${{ listing.price.toFixed(2) }}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-item-label>
          </q-slide-transition>
        </q-item-section>
        <q-separator/>
        <q-card-section class="q-pt-none">
          <div>
            <div class="row">
              <div class="col">
                Name
              </div>
              <div class="col">
                <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                      class="text-bold">{{ selectedProduct.name }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                Stock
              </div>
              <div class="col">
                <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                      class="text-bold">{{ selectedProduct.amount_in_stock }}</span>
              </div>
            </div>
            <!-- Order selected -->
            <q-slide-transition appear>
              <div v-if="Object.keys(order.selectedListing).length !== 0">
                <q-separator/>
                <div class="row">
                  <div class="col">
                    Price of selected order
                  </div>
                  <div class="col">
                    <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                          class="text-bold">${{ selectedListing.price }}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    Amount in selected order
                  </div>
                  <div class="col">
                    <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                          class="text-bold">{{ selectedListing.amount }}</span>
                  </div>
                </div>
                <q-separator class="q-mb-md"/>
                <div class="row">
                  <div class="col">
                    <q-input label="Quantity" type="number" :min="1"
                             @input="validateQuantity"
                             :max="selectedProduct.amount_in_stock / selectedListing.amount" filled
                             v-model.number="order.quantity"/>
                  </div>
                </div>
                <q-separator class="q-mb-md"/>
                <div class="row">
                  <div class="col">
                    Subtotal
                    <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                          class="text-bold">{{
                        order.quantity
                      }}</span> * <span
                    :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                    class="text-bold">{{ selectedListing.price }}</span>
                  </div>
                  <div class="col">
                    <span :class="{'text-positive': this.$q.dark.isActive, 'text-primary': !this.$q.dark.isActive}"
                          class="text-bold">${{ (order.quantity * selectedListing.price).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </q-slide-transition>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat v-if="Object.keys(order.selectedListing).length" @click="order.selectedListing = {}"
                 label="Reset"/>
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat :disabled="!Object.keys(order.selectedListing).length" @click="addToCart" label="Add to cart"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Orderform End -->
    <!-- Table Start -->
    <q-table
      :grid="isGrid"
      :loading="loading"
      :rows-per-page-options="rowsPerPageOptions"
      ref="items"
      :class="{'bg-accent': !$q.dark.isActive, 'bg-dark': $q.dark.isActive, 'shadow-8': navigationActive, 'no-outline': navigationActive}"
      class="full-width"
      tabindex="0"
      :data="data"
      color="primary"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :filter="filter"
      @focusin.native="activateNavigation"
      @focusout.native="deactivateNavigation"
      @keydown.native="onKey"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary"/>
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card class="q-pb-sm" :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-img contain class="productImage"
                     :src="props.row.image"/>
            </q-card-section>
            <q-card-section class="text-center">
              <h6>
                {{ props.row.name }}
              </h6>
            </q-card-section>
            <q-separator/>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>{{
                      props.cols.filter(function (col) {
                        return col.name === 'type';
                      })[0].label
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-capitalize">
                    <q-badge color="secondary">
                      {{
                        objectFlip(TYPES)[props.row.type]
                      }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="props.row.product_listings.length">
                <q-item-section>
                  <q-item-label>
                    Starting at
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>
                    <q-badge color="secondary">
                      {{ props.row.product_listings[0].amount }} for ${{ props.row.product_listings[0].price }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>{{
                      props.cols.filter(function (col) {
                        return col.name === 'amount_in_stock';
                      })[0].label
                    }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>
                    <q-badge :color="props.row.amount_in_stock ? 'positive' : 'negative'">
                      {{
                        props.row.amount_in_stock
                      }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator/>
            <div v-if="getBiggestDiscount(props.row.product_listings)" class="text-center q-py-md">
              Get a bundle of <span class="text-positive text-bold">{{
                getBiggestDiscount(props.row.product_listings).amount
              }}</span> at a discounted price of <span
              class="text-positive text-bold">${{ getBiggestDiscount(props.row.product_listings).price }}</span>!
            </div>
            <q-separator v-if="getBiggestDiscount(props.row.product_listings)"/>
            <q-card-actions align="around">
              <q-btn :disabled="!props.row.amount_in_stock || !props.row.product_listings.length"
                     @click="openOrderForm(props.row)" flat style="width:100%">
                Add to cart
              </q-btn>
              <q-tooltip color="warning" v-if="!props.row.amount_in_stock">Product not in stock</q-tooltip>
              <q-tooltip color="warning" v-if="!props.row.product_listings.length">No product listings available
              </q-tooltip>
            </q-card-actions>
          </q-card>
        </div>
      </template>
      <template v-slot:body-cell-hidden="props">
        <q-td :props="props">
          <div v-if="props.value">
            <q-icon name="check_circle" class="text-primary" style="font-size: 3em;"/>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <div class="text-capitalize">
            {{ objectFlip(TYPES)[props.value] }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <div>
            <img width="50" :src="props.value">
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          <div class="row q-gutter-sm">
            <q-btn class="text-center" :key="listing.id" v-for="listing in props.row.product_listings"
                   color="secondary">
              {{ listing.amount }} × {{ (listing.price / listing.amount).toFixed(2) }}
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                anchor="top middle"
                self="bottom middle">
                Total ${{ listing.price.toFixed(2) }}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-toggle v-model="isGrid" label="Grid"/>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm" :class="{'text-black': !$q.dark.isActive}">
          <q-icon size="2em" name="sentiment_dissatisfied"/>
          <span>
            Well this is sad... {{ message }}
          </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon"/>
        </div>
      </template>
    </q-table>
    <!-- Table end -->
  </q-page>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Validations} from 'vuelidate-property-decorators';
import {required, requiredIf} from 'vuelidate/lib/validators';

@Component({
  components: {}
})
export default class Shop extends Vue {
  @Validations()
  validations = {
    order: {
      quantity: {required}
    },
    additionalData: {
      includeCodes: {required},
      includeBulk: {required},
      bulkSpecifics: {
        required: requiredIf((bulkSpecificsModel) => {
          return this.additionalData.includeBulk;
        })
      },
      futurePackRequests: {}
    }
  }

  public isGrid = true;
  public data: unknown[] = [];
  public loading = false;
  public navigationActive = false;
  public orderFormLoadingState = false;
  public orderFormState = false;
  public shoppingCartState = false;
  public shoppingCartLoadingState = false;
  public additionalData: {
    includeCodes: boolean;
    includeBulk: boolean;
    bulkSpecifics?: string;
    futurePackRequests: string;
  } = {
    includeCodes: false,
    includeBulk: false,
    bulkSpecifics: undefined,
    futurePackRequests: ''
  };
  public order: {
    selectedProduct?: any;
    selectedListing?: any;
    quantity?: number;
  } = {
    selectedProduct: {},
    selectedListing: {},
    quantity: 1,
  };

  filter = '';
  // eslint-disable-next-line
  selected: any = [];
  // eslint-disable-next-line
  pagination: any = {};

  columns = [
    {name: 'image', label: 'Image', field: 'image', align: 'left'},
    {name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left'},
    {name: 'type', label: 'Type', field: 'type', align: 'left'},
    {name: 'price', label: 'Price', field: 'price_listings', sortable: true, align: 'left'},
    {name: 'amount_in_stock', label: 'Amount in stock', field: 'amount_in_stock', sortable: true, align: 'left'},
  ];

  TYPES = {
    single: 0,
    'ETB': 1,
    tin: 2,
    'Booster box': 3,
    'Misc box': 4,
  };

  get cartTotal() {
    return Object.values(this.$store.getters['shop/getCart']).reduce((total: number, obj: any) => (obj.order.price * obj.quantity) + total, 0).toFixed(2);
  }

  getBiggestDiscount(productLines: any[]) {
    let discountLines = productLines.filter(productLine => productLine.isDiscount);
    discountLines = discountLines.reverse();

    return discountLines.length ? discountLines[0] : null;
  }

  getAvailableListings(productListings: { amount: number; }[]) {
    return productListings && productListings.length ? productListings.filter(productListing => productListing.amount <= this.order.selectedProduct.amount_in_stock) : [];
  }

  activateNavigation() {
    this.navigationActive = true;
  };

  deactivateNavigation() {
    this.navigationActive = false;
  };

  get rowsPerPageOptions() {
    return this.isGrid ? [12, 24, 48] : [10, 20, 50, 100];
  }

  get selectedProduct() {
    return this.order.selectedProduct;
  }

  get selectedListing() {
    return this.order.selectedListing;
  }

  protected objectFlip(obj: any) {
    const ret: any = {};
    Object.keys(obj).forEach(key => {
      ret[obj[key]] = key;
    });
    return ret;
  }

  onKey(evt: { keyCode: number; preventDefault: () => void; }) {
    if (
      !this.navigationActive || [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
      this.$refs.items === void 0
    ) {
      return
    }

    evt.preventDefault()

    // eslint-disable-next-line
    const tableRef: any = this.$refs.items;
    // eslint-disable-next-line
    const {computedRowsNumber, computedRows} = tableRef

    if (computedRows.length === 0) {
      return
    }

    const currentIndex = this.selected.length > 0 ? computedRows.indexOf(this.selected[0]) : -1
    const currentPage = this.pagination.page
    const rowsPerPage = this.pagination.rowsPerPage === 0 ? computedRowsNumber : this.pagination.rowsPerPage
    const lastIndex = computedRows.length - 1
    const lastPage = Math.ceil(computedRowsNumber / rowsPerPage)

    let index: number = currentIndex
    let page: number = currentPage

    switch (evt.keyCode) {
      case 36: // Home
        page = 1
        index = 0
        break
      case 35: // End
        page = lastPage
        index = rowsPerPage - 1
        break
      case 33: // PageUp
        page = currentPage <= 1 ? lastPage : currentPage - 1
        if (index < 0) {
          index = 0
        }
        break
      case 34: // PageDown
        page = currentPage >= lastPage ? 1 : currentPage + 1
        if (index < 0) {
          index = rowsPerPage - 1
        }
        break
      case 38: // ArrowUp
        if (currentIndex <= 0) {
          page = currentPage <= 1 ? lastPage : currentPage - 1
          index = rowsPerPage - 1
        } else {
          index = currentIndex - 1
        }
        break
      case 40: // ArrowDown
        if (currentIndex >= lastIndex) {
          page = currentPage >= lastPage ? 1 : currentPage + 1
          index = 0
        } else {
          index = currentIndex + 1
        }
        break
    }

    if (page !== this.pagination.page) {
      this.pagination = {
        ...this.pagination,
        page
      }

      this.$nextTick(() => {
        // eslint-disable-next-line
        const {computedRows}: any = this.$refs.items;
        this.selected = [computedRows[Math.min(index, computedRows.length - 1)]]
      })
    } else {
      this.selected = [computedRows[index]]
    }
  }

  openOrderForm(product: any) {
    // this.order.selectedListing = listing;
    this.order.selectedProduct = product;
    this.order.quantity = 1;
    this.orderFormState = true;
  }

  processOrderForm() {
    this.$v.$touch();
    if (!this.$v.$invalid) {

    } else {

    }
  }

  validateQuantity(value: number) {
    const min = 1;
    const max = Math.floor(this.order.selectedProduct.amount_in_stock / this.order.selectedListing.amount);
    if (value <= 0) {
      this.order.quantity = min;
      this.$q.notify({
        type: 'warning',
        message: 'You need to order at least 1',
      });
    } else if (value > max) {
      this.order.quantity = max;
      this.$q.notify({
        type: 'warning',
        message: `You can only order up to ${max} due to stock limits`,
      });
    }
  }

  setSelectedListing(listing: any) {
    this.order.selectedListing = listing;
  }



  addToCart() {
    this.orderFormLoadingState = true;
    this.$axios.post('shop/addToCart', {order: this.order.selectedListing, quantity: this.order.quantity}).then(
      response => {
        this.$q.notify({
          type: 'positive',
          message: 'Product added to cart!'
        });

        this.$store.commit('shop/setCart', response.data);
      }
    ).finally(
      () => {
        this.orderFormLoadingState = false;
        this.orderFormState = false;
      }
    );
  }

  showShoppingCart() {
    this.shoppingCartState = true;
    this.shoppingCartLoadingState = true;
    this.$store.dispatch('shop/fetchShoppingCart').finally(
      () => {
        this.shoppingCartLoadingState = false;
      }
    )
  }

  clearShoppingCart() {
    this.shoppingCartLoadingState = true;
    this.$store.dispatch('shop/clearShoppingCart').finally(
      () => {
        this.shoppingCartLoadingState = false;
      }
    )
  }

  submitOrder() {
    this.$v.additionalData.$touch();
    if (!this.$v.additionalData.$invalid) {
      if (this.$store.getters['auth/user'].discord_nickname) {
        this.shoppingCartLoadingState = true;
        this.$store.dispatch('shop/submitShoppingCart', {additionalData: this.additionalData}).then(
          response => {
            this.$router.push({name: 'orders'});
          }
        ).finally(
          () => {
            this.shoppingCartLoadingState = false;
          }
        );
      }
    } else {
      this.$q.notify({
        message: 'Some additional data fields are invalid. Please check them and try again.',
        type: 'warning'
      })
    }
  }

  created() {
    this.loading = true;
    const cartPromise = this.$store.dispatch('shop/fetchShoppingCart');
    const params = this.$route.params.category !== undefined ? {type: parseInt(this.$route.params.category)} : {};
    const shopPromise = this.$axios.get('shop', {params: params}).then(
      response => {
        this.data = response.data as unknown[];
      }
    );

    Promise.all([cartPromise, shopPromise]).finally(
      () => {
        this.loading = false;
      }
    )
  }
};
</script>

<style lang="scss">
.productImage {
  height: 250px
}
</style>

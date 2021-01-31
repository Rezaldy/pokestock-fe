<template>
  <q-page class="column items-top justify-start q-px-xl q-py-md">
    <div class="bg-accent rounded-borders">
      <q-card class="product-card q-pt-lg" flat bordered>
        <q-btn @click="$router.push({name: 'products'})" round color="primary" icon="arrow_left" class="q-ml-lg">
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            anchor="top middle"
            self="bottom middle">
            Back to products
          </q-tooltip>
        </q-btn>
        <q-img contain class="product-image" :src="image"/>
        <q-card-section>
          <q-badge color="secondary text-capitalize">{{ type }}</q-badge>
          <div class="text-h4 q-mt-sm q-mb-xs">{{ name }}</div>
          <div class="text-caption text-grey">
            {{ description }}
          </div>
          <div class="text-h5 q-mt-sm q-mb-xs">Amount in stock: {{ amount_in_stock }}</div>
          <div class="text-h6 q-mt-sm q-mb-xs">Withheld stock: {{ hidden_stock }}</div>
          <q-btn @click="showProductInfo" color="primary" icon="edit" label="Edit product" class="q-mr-sm"/>
          <q-btn @click="confirmRemoveProduct" color="negative" icon="delete" label="Remove product" class="q-mr-sm"/>
          <q-dialog v-model="productFormState" persistent transition-show="scale" transition-hide="scale">
            <q-card :class="{ 'bg-dark': $q.dark.isActive, 'bg-primary': !$q.dark.isActive }" class="text-white"
                    style="width: 300px">
              <q-card-section>
                <div class="text-h6">Edit Product</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input class="q-mt-sm" :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                         stack-label required dense filled v-model="productFormData.name"
                         label="Product name"/>
                <q-input class="q-mt-sm" :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                         autogrow stack-label required dense filled v-model="productFormData.description"
                         label="Description"/>
                <q-input class="q-mt-sm" type="number"
                         :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                         stack-label required dense filled v-model="productFormData.amount_in_stock"
                         label="Amount in stock"/>
                <q-input class="q-mt-sm" type="number"
                         :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                         stack-label required dense filled v-model="productFormData.hidden_stock"
                         label="Withheld stock"/>
                <q-select class="q-mt-sm" filled map-options emit-value
                          :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                          v-model="productFormData.type" :options="typesArray" label="Type"/>
                <q-toggle class="q-mt-sm" checked-icon="check" color="secondary" unchecked-icon="clear"
                          v-model="productFormData.hidden" label="Product is hidden"/>
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn flat @click="editProduct" label="Edit Product" v-close-popup/>
              </q-card-actions>
              <q-inner-loading :showing="dialogLoading">
                <q-spinner-gears size="50px" color="primary"/>
              </q-inner-loading>
            </q-card>
          </q-dialog>
          <q-btn @click="showImageForm" color="primary" icon="edit" label="Edit product image"/>
          <q-dialog v-model="imageFormState" persistent transition-show="scale" transition-hide="scale">
            <q-card :class="{ 'bg-dark': $q.dark.isActive, 'bg-primary': !$q.dark.isActive }" class="text-white"
                    style="width: 300px">
              <q-card-section>
                <div class="text-h6">Edit Image</div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-file
                  class="bg-accent rounded-borders q-pa-xs"
                  style="max-width: 300px"
                  v-model="imageFile"
                  rounded
                  label="Image"
                />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn flat @click="editProductImage" label="Edit image"/>
              </q-card-actions>
              <q-inner-loading :showing="dialogLoading">
                <q-spinner-gears size="50px" color="primary"/>
              </q-inner-loading>
            </q-card>
          </q-dialog>
        </q-card-section>

        <q-card-actions>
          <q-btn
            color="grey"
            rounded
            flat
            label="Product listings"
            :icon="expandedProductListings ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expandedProductListings = !expandedProductListings"
          />
        </q-card-actions>

        <q-slide-transition>
          <div v-show="expandedProductListings">
            <q-separator/>
            <q-card-section class="text-subitle2">
              <q-table
                :grid="$q.screen.xs"
                :loading="loading"
                ref="productListings"
                :class="tableClass"
                tabindex="0"
                title="Product listings"
                :data="productListingsData"
                color="primary"
                :columns="columns"
                row-key="id"
                selection="multiple"
                :selected.sync="selected"
                :pagination.sync="pagination"
                :filter="filter"
                @focusin.native="activateNavigation"
                @focusout.native="deactivateNavigation"
                @keydown.native="onKey"
                @row-click="onRowClick"
              >
                <template v-slot:loading>
                  <q-inner-loading showing color="primary"/>
                </template>
                <template v-slot:item="props">
                  <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''"
                  >
                    <q-card :class="props.selected ? 'bg-grey-2' : ''">
                      <q-card-section>
                        <q-checkbox dense v-model="props.selected" :label="props.row.name"/>
                      </q-card-section>
                      <q-card-section>
                        <q-img :src="props.cols.filter(function(col){return col.name === 'image'})[0].value"/>
                      </q-card-section>
                      <q-separator/>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{
                                props.cols.filter(function (col) {
                                  return col.name === 'amount';
                                })[0].label
                              }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{
                                props.cols.filter(function (col) {
                                  return col.name === 'amount';
                                })[0].value
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{
                                props.cols.filter(function (col) {
                                  return col.name === 'price';
                                })[0].label
                              }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{
                                props.cols.filter(function (col) {
                                  return col.name === 'price';
                                })[0].value
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{
                                props.cols.filter(function (col) {
                                  return col.name === 'isDiscount';
                                })[0].label
                              }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption class="text-primary">
                              {{
                                props.cols.filter(function (col) {
                                  return col.name === 'isDiscount';
                                })[0].value ?
                                  '\u2713' : ''
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </div>
                </template>


                <template v-slot:header-selection="scope">
                  <q-toggle v-model="scope.selected"/>
                </template>

                <template v-slot:body-selection="scope">
                  <q-toggle v-model="scope.selected"/>
                </template>
                <template v-slot:body-cell-isDiscount="props">
                  <q-td :props="props">
                    <div v-if="props.value">
                      <q-icon name="check_circle" class="text-primary" style="font-size: 3em;"/>
                    </div>
                    <div v-else>

                    </div>
                  </q-td>
                </template>
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                  <q-btn round @click="openForm" :color="$q.dark.isActive ? 'secondary': 'primary'"
                         icon="control_point"/>
                  <q-dialog v-model="listingFormState" persistent transition-show="scale" transition-hide="scale">
                    <q-card :class="{ 'bg-primary': $q.dark.isActive, 'bg-primary': !$q.dark.isActive }"
                            class="text-white"
                            style="width: 300px">
                      <q-card-section>
                        <div v-if="listingData.id" class="text-h6">Edit Listing</div>
                        <div v-else class="text-h6">New Listing</div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <q-input class="q-mt-sm"
                                 :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                                 stack-label required dense filled v-model="listingData.amount"
                                 label="Amount per order"/>
                        <q-input class="q-mt-sm"
                                 :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                                 stack-label required dense filled v-model="listingData.price"
                                 label="Price"/>
                        <q-toggle class="q-mt-sm" checked-icon="check" color="secondary" unchecked-icon="clear"
                                  v-model="listingData.isDiscount" label="Is this a discount?"/>
                      </q-card-section>
                      <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="Cancel" v-close-popup/>
                        <q-btn flat v-if="!listingData.id" @click="addListing" label="Add Listing" v-close-popup/>
                        <q-btn flat v-else @click="editListing" label="Edit Listing" v-close-popup/>
                        <q-separator vertical inset/>
                        <q-btn flat @click="deleteListing" class="text-negative" v-if="listingData.id" label="Delete"
                               v-close-popup/>
                      </q-card-actions>
                      <q-inner-loading :showing="dialogLoading">
                        <q-spinner-gears size="50px" color="primary"/>
                      </q-inner-loading>
                    </q-card>
                  </q-dialog>
                </template>
                <template v-slot:no-data="{ icon, message, filter }">
                  <div class="full-width row flex-center text-accent q-gutter-sm"
                       :class="{'text-black': !$q.dark.isActive}">
                    <q-icon size="2em" name="sentiment_dissatisfied"/>
                    <span>
                      Well this is sad... {{ message }}
                    </span>
                    <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon"/>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </div>
        </q-slide-transition>

        <q-card-actions>
          <q-btn
            color="grey"
            rounded
            flat
            label="Product log"
            :icon="expandedProductLog ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expandedProductLog = !expandedProductLog"
          />
        </q-card-actions>
        <q-slide-transition>
          <div v-show="expandedProductLog">
            <q-separator/>
            <q-card-section class="text-subitle2">
              <q-table
                dense
                :loading="productLogLoading"
                ref="productListings"
                :class="tableClass"
                tabindex="0"
                title="Product log"
                :data="productLogData"
                color="primary"
                :columns="logColumns"
                row-key="id"
                selection="multiple"
                :selected.sync="selected"
                :pagination.sync="pagination"
                :filter="filter"
                @focusin.native="activateNavigation"
                @focusout.native="deactivateNavigation"
                @keydown.native="onKey"
              >
                <template v-slot:loading>
                  <q-inner-loading showing color="primary"/>
                </template>

                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width/>
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width>
                      <q-btn size="sm" color="primary" round dense @click="props.expand = !props.expand"
                             :icon="props.expand ? 'remove' : 'add'"/>
                    </q-td>
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.value }}
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="text-left">
                        <div class="text-h5">Changes made by {{ props.row.user.twitch_nickname }}</div>
                        <table>
                          <thead>
                            <th>Value changed</th>
                            <th>Old value</th>
                            <th>New value</th>
                          </thead>
                          <tbody>
                          <tr v-for="item in getDifferences(props.row.old_values, props.row.new_values)">
                            <td>{{ item.key }}</td>
                            <td>{{ item.oldValue }}</td>
                            <td>{{ item.newValue }}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </q-td>
                  </q-tr>
                </template>

                <template v-slot:no-data="{ icon, message, filter }">
                  <div class="full-width row flex-center text-accent q-gutter-sm"
                       :class="{'text-black': !$q.dark.isActive}">
                    <q-icon size="2em" name="sentiment_dissatisfied"/>
                    <span>
                      Well this is sad... {{ message }}
                    </span>
                    <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon"/>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})

export default class Products extends Vue {
  public listingFormState = false;
  public productFormState = false;
  public imageFormState = false;
  public productChangeLogState = false;
  public expandedProductListings = true;
  public expandedProductLog = false;
  public loading = false;
  public productLogLoading = false;
  public navigationActive = false;
  public dialogLoading = false;
  public filter = '';
  // eslint-disable-next-line
  public selected: any = [];
  // eslint-disable-next-line
  public pagination: any = {};
  public columns = [
    {name: 'amount', label: 'Amount', field: 'amount', sortable: true, align: 'left'},
    {name: 'price', label: 'Price', field: 'price', sortable: true, align: 'left'},
    {name: 'isDiscount', label: 'Is discount', field: 'isDiscount', sortable: true, align: 'center'},
  ];
  public logColumns = [
    {
      name: 'user',
      label: 'Changed by',
      field: (row: { user: { twitch_nickname: any; }; }) => row.user.twitch_nickname,
      sortable: true,
      align: 'left'
    },
    {
      name: 'created_at',
      label: 'Changed at',
      field: (row: { created_at: string | number | Date; }) => new Date(row.created_at).toLocaleString(),
      sortable: true,
      align: 'left'
    },
  ];
  public data: {
    id?: number;
    amount_in_stock?: number;
    image?: string;
    name?: string;
    type?: number;
    hidden?: boolean;
    [key: string]: any;
  } = {
    id: undefined,
    amount_in_stock: undefined,
    image: undefined,
    name: undefined,
    type: undefined,
    hidden: undefined,
  };

  public productLogData = [];

  public productFormData: {
    id?: number;
    amount_in_stock?: number;
    hidden_stock?: number;
    image?: string;
    name?: string;
    type?: number;
    hidden?: boolean;
    [key: string]: any;
  } = {
    id: undefined,
    amount_in_stock: undefined,
    hidden_stock: undefined,
    image: undefined,
    name: undefined,
    type: undefined,
    hidden: undefined,
  };
  public image?: string = '';
  public type?: string = '';
  public name?: string = '';
  public description?: string = '';
  public amount_in_stock?: number = 0;
  public hidden_stock?: number = 0;
  public productListingsData = [];
  public listingData: {
    id?: number,
    product_id: number,
    amount: number;
    price: number;
    isDiscount: boolean;
  } = {
    id: undefined,
    product_id: parseInt(this.$route.params.id),
    amount: 0,
    price: 0.00,
    isDiscount: false,
  };
  public imageFile?: any = null;

  TYPES = {
    single: 0,
    'ETB': 1,
    tin: 2,
    'Booster box': 3,
    'Misc box': 4,
  };

  typesArray = [
    {label: 'Single', value: 0},
    {label: 'ETB', value: 1},
    {label: 'Tin', value: 2},
    {label: 'Boosterbox', value: 3},
    {label: 'Miscbox', value: 4},
  ];

  activateNavigation() {
    this.navigationActive = true;
  }

  deactivateNavigation() {
    this.navigationActive = false;
  }

  protected getDifferences(oldObject: { [key: string]: any }, newObject: { [key: string]: any }) {
    const differences = [];

    for (const [key, value] of Object.entries(oldObject)) {
      if (value !== newObject[key]) {
        differences.push({
          key,
          oldValue: value,
          newValue: newObject[key]
        });
      }
    }

    return differences;
  }

  tableClass() {
    return this.navigationActive ? 'shadow-8 no-outline' : void 0
  }

  onKey(evt: { keyCode: number; preventDefault: () => void; }) {
    if (
      !this.navigationActive || [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
      this.$refs.products === void 0
    ) {
      return
    }

    evt.preventDefault()

    // eslint-disable-next-line
    const tableRef: any = this.$refs.products;
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
        const {computedRows}: any = this.$refs.products;
        this.selected = [computedRows[Math.min(index, computedRows.length - 1)]]
      })
    } else {
      this.selected = [computedRows[index]]
    }
  }

  protected created() {
    this.loading = true;
    const promiseProduct = this.fetchProduct();
    const promiseProductListings = this.fetchProductListings();

    Promise.all([promiseProduct, promiseProductListings]).then(() => {
      this.loading = false;
    });
  }

  protected onRowClick(event: any, row: any) {
    this.listingFormState = true;
    this.dialogLoading = true;
    void this.$axios.get(`/products/${this.$route.params.id}/productListings/${row.id}`).then(
      response => {
        this.listingData = {
          id: response.data.id,
          product_id: parseInt(this.$route.params.id),
          amount: response.data.amount,
          price: response.data.price,
          isDiscount: !!response.data.isDiscount,
        }
      }
    ).finally(
      () => {
        this.dialogLoading = false;
      }
    );
  }

  protected objectFlip(obj: any) {
    const ret: any = {};
    Object.keys(obj).forEach(key => {
      ret[obj[key]] = key;
    });
    return ret;
  }

  protected openForm() {
    this.listingFormState = true;
    this.listingData = {
      id: undefined,
      product_id: parseInt(this.$route.params.id),
      amount: 0,
      price: 0.00,
      isDiscount: false,
    };
  }

  protected fetchProduct() {
    this.loading = true;
    this.productLogLoading = true
    const productPromise = this.$axios.get(`/products/${this.$route.params.id}`).then(
      response => {
        this.data = response.data;
        this.data.hidden = !!response.data.hidden;
        this.image = response.data.image;
        this.type = this.objectFlip(this.TYPES)[response.data.type];
        this.name = response.data.name;
        this.description = response.data.description;
        this.amount_in_stock = response.data.amount_in_stock;
        this.hidden_stock = response.data.hidden_stock;
      }
    ).catch(
      error => {
        this.$q.notify({
          type: 'negative',
          message: 'Something went wrong while fetching the product: ' + error
        })
      }
    );

    const auditsPromise = this.$axios.get(`/products/${this.$route.params.id}/audits`).then(
      response => {
        this.productLogData = response.data;
      }
    )

    Promise.all([productPromise, auditsPromise]).then(
      () => {
        this.loading = false;
        this.productLogLoading = false;
      }
    )
  }

  protected fetchProductListings() {
    return this.$axios.get(`/products/${this.$route.params.id}/productListings`).then(
      response => {
        this.productListingsData = response.data;
      }
    ).catch(
      error => {
        this.$q.notify({
          type: 'negative',
          message: 'Something went wrong while fetching product listings: ' + error
        })
      }
    )
  }

  protected addListing() {
    this.loading = true;
    void this.$axios.get(`/products/${this.$route.params.id}/productListings/create`, {params: this.listingData}).then(
      () => {
        this.fetchProductListings();
      }
    ).finally(
      () => {
        this.loading = false;
      }
    );
  }

  protected editListing() {
    this.loading = true;
    void this.$axios.patch(`/products/${this.$route.params.id}/productListings/${this.listingData.id}`, this.listingData).then(
      () => {
        this.fetchProductListings();
      }
    ).finally(
      () => {
        this.loading = false;
      }
    );
  }

  protected deleteListing() {
    this.loading = true;
    void this.$axios.delete(`/products/${this.$route.params.id}/productListings/${this.listingData.id}`).then(
      () => {
        this.fetchProductListings();
      }
    ).finally(
      () => {
        this.loading = false;
      }
    );
  }

  protected editProduct() {
    this.$q.loading.show();
    let data: {
      id?: number;
      amount_in_stock?: number;
      name?: string;
      type?: number;
      hidden?: boolean;
      [key: string]: any;
    } = {};
    data = Object.assign(data, this.data);


    void this.$axios.patch(`/products/${this.$route.params.id}`, data).then(
      () => {
        this.fetchProduct();
      }
    ).finally(
      () => {
        this.$q.loading.hide();
      }
    )
  }

  protected showProductInfo() {
    this.productFormData = this.data;
    this.productFormState = true;
  }

  protected showImageForm() {
    this.imageFormState = true;
  }

  protected showProductChangeLog() {
    this.productChangeLogState = true;
  }

  protected confirmRemoveProduct() {
    this.$q.dialog({
      title: 'Confirm removal',
      message: 'Would you like to remove this product?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.delete(`/products/${this.$route.params.id}`).then(
        () => {
          this.$q.notify({
            message: 'Product removed succesfully',
            type: 'positive'
          })
          this.$router.push({name: 'products'});
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )
    });
  }

  protected editProductImage() {
    let formData = new FormData();
    formData.append('image', this.imageFile);

    const requestConfig = {
      headers: {'content-type': 'multipart/form-data'}
    }

    this.$axios.post(`/products/${this.$route.params.id}/image/upload`, formData, requestConfig).then(
      () => {
        this.fetchProduct();
      }
    ).catch(
      error => {
        this.$q
      }
    )
      .finally(
        () => {
          this.imageFormState = false;
        }
      );
  }
};
</script>

<style lang="scss">
.product-image {
  max-height: 500px;
}
</style>

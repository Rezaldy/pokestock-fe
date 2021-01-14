<template>
  <q-page class="column items-top justify-start q-px-xl q-py-md">
    <span class="text-h1 text-white">Products</span>
    <div class="bg-accent rounded-borders">
      <q-dialog v-model="productFormState" persistent transition-show="scale" transition-hide="scale">
        <q-card :class="{ 'bg-dark': $q.dark.isActive, 'bg-primary': !$q.dark.isActive }" class="text-white"
                style="width: 300px">
          <q-card-section>
            <div class="text-h6">Add Product</div>
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
            <q-select class="q-mt-sm" filled map-options emit-value
                      :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                      v-model="productFormData.type" :options="typesArray" label="Type"/>
            <template v-slot:prepend>
              <q-icon name="attach_file"/>
            </template>
            <q-toggle class="q-mt-sm" checked-icon="check" color="secondary" unchecked-icon="clear"
                      v-model="productFormData.hidden" label="Product is hidden"/>
          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Cancel" v-close-popup/>
            <q-btn flat @click="addProduct" label="Add Product"/>
          </q-card-actions>
          <q-inner-loading :showing="dialogLoading">
            <q-spinner-gears size="50px" color="primary"/>
          </q-inner-loading>
        </q-card>
      </q-dialog>
      <q-table
        :grid="$q.screen.xs"
        :loading="loading"
        ref="products"
        :class="tableClass"
        tabindex="0"
        title="Products"
        :data="data"
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
                          return col.name === 'type';
                        })[0].label
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>{{
                        props.cols.filter(function (col) {
                          return col.name === 'type';
                        })[0].value
                      }}
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
                    <q-item-label caption>{{
                        props.cols.filter(function (col) {
                          return col.name === 'amount_in_stock';
                        })[0].value
                      }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>{{
                        props.cols.filter(function (col) {
                          return col.name === 'hidden';
                        })[0].label
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption class="text-primary">
                      {{
                        props.cols.filter(function (col) {
                          return col.name === 'hidden';
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
        <template v-slot:body-cell-hidden="props">
          <q-td :props="props">
            <div v-if="props.value">
              <q-icon name="check_circle" class="text-primary" style="font-size: 3em;"/>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <div>
              {{ capitalizeFirstLetter(objectFlip(TYPES)[props.value]) }}
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
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <q-btn @click="openProductForm" round color="primary" icon="control_point"/>
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
    </div>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})

export default class Products extends Vue {
  loading = false;
  dialogLoading = false;
  productFormState = false;
  navigationActive = false;

  filter = '';
  selected: any = [];
  pagination: any = {};
  columns = [
    {name: 'image', label: 'Image', field: 'image', align: 'left'},
    {name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left'},
    {name: 'price', label: 'Price', field: 'price', sortable: true, align: 'left'},
    {name: 'type', label: 'Type', field: 'type', align: 'left'},
    {name: 'amount_in_stock', label: 'Amount in stock', field: 'amount_in_stock', sortable: true, align: 'left'},
    // eslint-disable-next-line
    {name: 'hidden', label: 'Is hidden', field: 'hidden', sortable: true, align: 'center'},
  ];
  data = [];
  productFormData: {
    amount_in_stock?: number;
    name?: string;
    type?: number;
    hidden?: boolean;
    [key: string]: any;
  } = {
    amount_in_stock: undefined,
    name: undefined,
    type: undefined,
    hidden: false,
  };

  TYPES = {
    single: 0,
    etb: 1,
    tin: 2,
    boosterbox: 3,
    miscbox: 4,
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
  };

  deactivateNavigation() {
    this.navigationActive = false;
  };

  tableClass() {
    return this.navigationActive ? 'shadow-8 no-outline' : void 0
  };

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

    const currentIndex: number = this.selected.length > 0 ? computedRows.indexOf(this.selected[0]) : -1
    const currentPage: number = this.pagination.page
    const rowsPerPage: number = this.pagination.rowsPerPage === 0 ? computedRowsNumber : this.pagination.rowsPerPage
    const lastIndex: number = computedRows.length - 1
    const lastPage: number = Math.ceil(computedRowsNumber / rowsPerPage)

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
    this.fetchProducts();
  }

  protected onRowClick(event: any, row: any) {
    this.$router.push({name: 'product', params: { id: row.id}});
  }

  protected objectFlip(obj: any) {
    const ret: {
      [key: string] : any;
    } = {};
    Object.keys(obj).forEach(key => {
      ret[obj[key]] = key;
    });
    return ret;
  }

  protected capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  protected openProductForm() {
    this.productFormState = true;
  }

  protected fetchProducts() {
    this.loading = true;
    this.$axios.get('/products').then(
      response => {
        this.data = response.data as never[];
      }
    ).catch(
      error => {
        this.$q.notify({
          type: 'negative',
          message: 'Something went wrong: ' + JSON.stringify(error)
        })
      }
    )
      .finally(
        () => {
          this.loading = false;
        }
      );
  }

  protected addProduct() {
    this.dialogLoading = true;
    this.$axios.post('products', this.productFormData).then(
      () => {
        const productName: string = this.productFormData.name ? this.productFormData.name : '';
        this.$q.notify({
          type: 'positive',
          message: `Product ${productName} added`,
        })
      }
    ).finally(
      () => {
        this.productFormData = {
          amount_in_stock: undefined,
          name: undefined,
          type: undefined,
          hidden: false,
        };
        this.productFormState = false;
        this.dialogLoading = false;
        this.fetchProducts();
      }
    );
  }
};
</script>

<style lang="scss" scoped>
.q-data-table th {
  text-align: left;
}
</style>

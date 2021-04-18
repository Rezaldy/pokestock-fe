<template>
  <q-page class="column items-top justify-start q-px-xl q-py-md">
    <span class="text-h1 text-white">Products</span>
    <q-slide-transition appear>
      <div v-show="selected.length">
        <q-btn
          @click="confirmShowSelected"
          icon="visibility"
          key="positive"
          class="q-ma-sm inline-block"
          rounded
          color="positive"
          size="md"
          label="Show"/>
        <q-btn
          @click="confirmHideSelected"
          icon="visibility_off"
          key="warning"
          class="q-ma-sm inline-block"
          rounded
          color="info"
          size="md"
          label="Hide"/>
        <q-btn
          @click="confirmRemoveSelected"
          icon="delete"
          class="q-ma-sm inline-block"
          rounded
          color="negative"
          size="md"
          label="Remove"/>
      </div>
    </q-slide-transition>
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
            <q-input class="q-mt-sm" type="number"
                     :class="{'bg-accent': !$q.dark.isActive,'rounded-borders': !$q.dark.isActive}"
                     stack-label required dense filled v-model="productFormData.hidden_stock"
                     label="Withheld stock (hidden)"/>
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
        :rows-per-page-options="rowsPerPageOptions"
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
          <q-btn
            class="q-mx-sm"
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
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
import {exportFile} from 'quasar';
import {Vue, Component} from 'vue-property-decorator';


function wrapCsvValue(val: any, formatFn: any) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

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
    {name: 'id', label: 'ID', field: 'id', align: 'left'},
    {name: 'image', label: 'Image', field: 'image', align: 'left'},
    {name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left'},
    {name: 'type', label: 'Type', field: 'type', align: 'left'},
    {name: 'amount_in_stock', label: 'Amount in stock', field: 'amount_in_stock', sortable: true, align: 'left'},
    {name: 'hidden_stock', label: 'Withheld stock', field: 'hidden_stock', sortable: true, align: 'left'},
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
    groupbreak: 5,
    shipping: 99,
  };

  typesArray = [
    {label: 'Single', value: 0},
    {label: 'ETB', value: 1},
    {label: 'Tin', value: 2},
    {label: 'Boosterbox', value: 3},
    {label: 'Miscbox', value: 4},
    {label: 'Group Break', value: 5},
    {label: 'Shipping', value: 99},
  ];

  get rowsPerPageOptions() {
    return [12, 24, 48];
  }

  get tableClass() {
    return this.navigationActive ? 'shadow-8 no-outline' : void 0
  };

  activateNavigation() {
    this.navigationActive = true;
  };

  deactivateNavigation() {
    this.navigationActive = false;
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
    this.$router.push({name: 'product', params: {id: row.id}});
  }

  protected objectFlip(obj: any) {
    const ret: {
      [key: string]: any;
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

  confirmShowSelected() {
    const selectedIds = this.selected.map(
      (selectedItem: { id: number }) => {
        return selectedItem.id;
      }
    );
    this.$q.dialog({
      title: 'Confirm',
      message: `Would you like to show all ${selectedIds.length} selected products?`,
      cancel: true,
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post('/products/unhide.multiple', selectedIds).then(
        () => {
          this.fetchProducts();
          this.$q.notify({
            message: 'Done!',
            type: 'positive',
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  }

  confirmHideSelected() {
    const selectedIds = this.selected.map(
      (selectedItem: { id: number }) => {
        return selectedItem.id;
      }
    );
    this.$q.dialog({
      title: 'Confirm',
      message: `Would you like to hide all ${selectedIds.length} selected products?`,
      cancel: true,
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post('/products/hide.multiple', selectedIds).then(
        () => {
          this.fetchProducts();
          this.$q.notify({
            message: 'Done!',
            type: 'positive',
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  }

  confirmRemoveSelected() {
    const selectedIds = this.selected.map(
      (selectedItem: { id: number }) => {
        return selectedItem.id;
      }
    );
    this.$q.dialog({
      title: 'Confirm',
      message: `Would you like to remove all ${selectedIds.length} selected products?`,
      cancel: true,
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post('/products/remove.multiple', selectedIds).then(
        () => {
          this.fetchProducts();
          this.$q.notify({
            message: 'Done!',
            type: 'positive',
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )
    }).onCancel(() => {

    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  }

  exportTable() {
    // Filter out image column
    const filteredColumns = this.columns.filter(column => column.field !== 'image');

    // naive encoding to csv format
    const content = [filteredColumns.map(col => wrapCsvValue(col.label, void 0))].concat(
      this.data.map(row => filteredColumns.map(col => wrapCsvValue(
        typeof col.field === 'function'
          // @ts-ignore
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field],
        // @ts-ignore
        col.format
      )).join(','))
    ).join('\r\n')

    const status = exportFile(
      'table-export.csv',
      content,
      'text/csv'
    )

    if (status !== true) {
      this.$q.notify({
        message: 'Browser denied file download...',
        color: 'negative',
        icon: 'warning'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.q-data-table th {
  text-align: left;
}
</style>

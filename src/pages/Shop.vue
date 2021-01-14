<template>
  <q-page class="row items-start justify-start q-pa-xl">

    <p class="text-h1 text-white text-center full-width ">Shop</p>
    <q-table
      :grid="isGrid"
      :loading="loading"
      :rows-per-page-options="rowsPerPageOptions"
      ref="products"
      :class="{'bg-accent': !$q.dark.isActive, 'bg-dark': $q.dark.isActive, 'shadow-8': navigationActive, 'no-outline': navigationActive}"
      class="full-width"
      tabindex="0"
      title="Products"
      :data="data"
      color="primary"
      :columns="columns"
      row-key="id"
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
                  <q-item-label caption class="text-capitalize">{{
                      objectFlip(TYPES)[props.cols.filter(function (col) {
                        return col.name === 'type';
                      })[0].value]
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
            </q-list>
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
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Shop extends Vue {
  public isGrid = true;
  public data: unknown[] = [];
  public loading = false;
  public navigationActive = false;

  filter = '';
  // eslint-disable-next-line
  selected: any = [];
  // eslint-disable-next-line
  pagination: any = {};

  columns = [
    {name: 'image', label: 'Image', field: 'image', align: 'left'},
    {name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left'},
    {name: 'price', label: 'Price', field: 'price', sortable: true, align: 'left'},
    {name: 'type', label: 'Type', field: 'type', align: 'left'},
    {name: 'amount_in_stock', label: 'Amount in stock', field: 'amount_in_stock', sortable: true, align: 'left'},
  ];

  TYPES = {
    single: 0,
    'ETB': 1,
    tin: 2,
    'Booster box': 3,
    'Misc box': 4,
  };

  protected onRowClick(event: any, row: {id: string}): Promise<any> {
    return this.$router.push({name: 'shopItem', params: {id: row.id}});
  }

  activateNavigation() {
    this.navigationActive = true;
  };

  deactivateNavigation() {
    this.navigationActive = false;
  };

  get rowsPerPageOptions () {
    return this.isGrid ? [ 12, 24, 48 ] : [ 10, 20, 50, 100 ];
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

  created() {
    this.loading = true;
    this.$axios.get('shop').then(
      response => {
        this.data = response.data as unknown[];
      }
    ).finally(
      () => {
        this.loading = false;
      }
    )
  }
};
</script>

<style lang="scss">
</style>

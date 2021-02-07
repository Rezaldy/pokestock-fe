<template>
  <q-page padding>
    <div class="full-width row flex-center q-mb-sm">
      <q-btn
        @click="status = []"
        v-if="status.length"
        :color="$q.dark.isActive ? 'dark' : 'primary'"
        rounded
        push
        label="Reset filter"
      />
      <q-btn-group rounded>
        <q-btn
          :class="{insetShadow: status.indexOf('new') > -1}"
          @click="toggleStatus('new')"
          :color="$q.dark.isActive ? 'dark' : 'primary'"
          rounded
          :unelevated="status.indexOf('new') > -1"
          :push="status.indexOf('new') === -1"
          label="New"
        />
        <q-btn
          :class="{insetShadow: status.indexOf('paid') > -1}"
          @click="toggleStatus('paid')"
          :color="$q.dark.isActive ? 'dark' : 'primary'"
          rounded
          :unelevated="status.indexOf('paid') > -1"
          :push="status.indexOf('paid') === -1"
          label="Paid"
        />
        <q-btn
          :class="{insetShadow: status.indexOf('paymentConfirmed') > -1}"
          @click="toggleStatus('paymentConfirmed')"
          :color="$q.dark.isActive ? 'dark' : 'primary'"
          rounded
          :unelevated="status.indexOf('paymentConfirmed') > -1"
          :push="status.indexOf('paymentConfirmed') === -1"
          label="Payment confirmed"
        />
        <q-btn
          :class="{insetShadow: status.indexOf('completed') > -1}"
          @click="toggleStatus('completed')"
          :color="$q.dark.isActive ? 'dark' : 'primary'"
          rounded
          :unelevated="status.indexOf('completed') > -1"
          :push="status.indexOf('completed') === -1"
          label="Completed"
        />
        <q-btn
          :class="{insetShadow: status.indexOf('cancelled') > -1}"
          @click="toggleStatus('cancelled')"
          :color="$q.dark.isActive ? 'dark' : 'primary'"
          rounded
          :unelevated="status.indexOf('cancelled') > -1"
          :push="status.indexOf('cancelled') === -1"
          label="Cancelled"
        />
      </q-btn-group>
    </div>
    <q-table
      dense
      :loading="loading"
      ref="orders"
      :class="tableClass"
      tabindex="0"
      title="Orders"
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

      <template v-slot:header-selection="scope">
        <q-toggle v-model="scope.selected"/>
      </template>

      <template v-slot:body-selection="scope">
        <q-toggle v-model="scope.selected"/>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
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
          <q-td colspan="100%" class="bg-primary">
            <div>
              <div class="text-h4">Order {{ props.row.id }}</div>
              <div class="text-h5">Items in order</div>
              <q-separator/>
              <table>
                <thead>
                <th>Image</th>
                <th>Name</th>
                <th>Amount</th>
                </thead>
                <tbody>
                <tr v-for="product in props.row.order_lines">
                  <td>
                    <q-img :src="product.product_listing.product.image"/>
                  </td>
                  <td>{{ product.product_listing.product.name }}</td>
                  <td>{{ product.product_listing.amount * product.quantity }}</td>
                </tr>
                </tbody>
              </table>
              <div>
                <div class="text-h5">Wants bulk</div>
                <q-separator/>
                <span v-if="props.row.includesBulk">
                  <q-icon name="thumb_up" class="yesNoIcon text-green q-mt-sm"/>
                </span>
                <span v-else>
                  <q-icon name="thumb_down" class="yesNoIcon text-red q-mt-sm"/>
                </span>
              </div>
              <div>
                <div class="text-h5">Wants codes</div>
                <q-separator/>
                <span v-if="props.row.includesCodes">
                  <q-icon name="thumb_up" class="yesNoIcon text-green q-mt-sm"/>
                </span>
                <span v-else>
                  <q-icon name="thumb_down" class="yesNoIcon text-red q-mt-sm"/>
                </span>
              </div>
              <div>
                <div class="text-h5">Request for future packs</div>
                <q-separator/>
                <div>{{ props.row.futurePackRequest ? props.row.futurePackRequest : 'None' }}</div>
              </div>
              <div>
                <div class="text-h5">Order info</div>
                <q-separator/>
                <q-btn class="q-mt-sm" @click="$router.push({name:'order', params:{id: props.row.id}})" icon="send"
                       label="Go to order" color="secondary"/>
              </div>
            </div>
          </q-td>
        </q-tr>
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
import {Vue, Component, Watch} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Orders extends Vue {
  loading = false;
  dialogLoading = false;
  navigationActive = false;
  status: string[] = [];


  filter = '';
  selected: any = [];
  pagination: any = {};

  columns = [
    {name: 'id', label: 'ID', field: 'id', align: 'left'},
    {
      name: 'customer',
      label: 'Customer',
      field: (row: { customer: { twitch_nickname: any; }; }) => row.customer.twitch_nickname,
      align: 'left'
    },
    {
      name: 'totalPrice',
      label: 'Total price',
      field: (row: { totalPrice: any; }) => `$${row.totalPrice}`,
      align: 'left'
    },
    {
      name: 'created_at',
      label: 'Created at',
      field: (row: { created_at: string | number | Date; }) => new Date(row.created_at).toLocaleString(),
      align: 'left'
    },
  ];

  data = [];

  @Watch('status')
  statusChanged() {
    this.fetchOrders();
  }

  get rowsPerPageOptions() {
    return [20, 40, 60, 80, 100];
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

  protected onRowClick(event: any, row: any) {
    this.$router.push({name: 'order', params: {id: row.id}});
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

  toggleStatus(status: string) {
    if(this.status.indexOf(status as never) === -1) {
      this.status.push(status);
    } else {
      this.status.splice(this.status.indexOf(status as never), 1);
    }
  }

  fetchOrders() {
    this.loading = true;
    const options = {
      params: {
        status: []
      }
    };

    if (this.status.length) {
      options.params.status = this.status as never[];
    }

    this.$axios.get('/orders', options).then(
      response => {
        this.data = response.data;
      }
    ).finally(
      () => {
        this.loading = false;
      }
    )
  }

  created() {
    this.fetchOrders();
  }
}
</script>

<style lang="scss" scoped>
.yesNoIcon {
  font-size: 3em;
}

.insetShadow {
  -webkit-box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.6);
  -moz-box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.6);
  box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.6);
}
</style>

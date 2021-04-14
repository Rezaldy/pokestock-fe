<template>
  <q-page padding>
    <q-card class="product-card q-pa-lg" flat bordered>
      <div class="text-h2">Order #{{ $route.params.id }}</div>
      <q-separator/>
      <div class="row q-col-gutter-md q-mt-sm">
        <div class="col">
          <div class="text-h4 full-width">
            Order lines
          </div>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col">
          <q-table
            :loading="loading"
            dense
            :data="data.order_lines"
            :columns="columns"
            row-key="name"
            :rows-per-page-options="[0]"
            hide-bottom
          >
            <template v-slot:body-cell-amount="props">
              <q-td :props="props">
                <q-badge color="blue" :label="props.value"/>
              </q-td>
            </template>
            <template v-slot:body-cell-isCompleted="props">
              <q-td :props="props" auto-width>
                <span
                  v-if="!user.isAdmin || (user.id === data.customer_id && ['paid', 'paymentConfirmed'].indexOf(data.status) === -1)">
                  {{ props.value ? 'Yes' : 'No' }}
                </span>
                <q-toggle
                  v-else
                  @input="toggleFulfillment(props.row)"
                  :value="props.value"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                />
              </q-td>
            </template>

            <template v-slot:loading>
              <q-inner-loading showing color="accent"/>
            </template>
          </q-table>
          <div>
            <div class="col col-4">
              <div class="text-h4 full-width">
                Payment
              </div>
            </div>
            <div v-if="!user.isAdmin || (user.id === data.customer_id && data.status === 'new')" class="col col-4">
              <div v-if="data.status !== 'cancelled'">
                <div v-if="data.status !== 'paid' && data.status !== 'paymentConfirmed'">
                  <div class="row q-mb-md">
                    <q-btn class="col-12 q-py-md" type="a" :href="`https://paypal.me/MLBreaks/${data.totalPrice}USD`"
                           target="_blank"
                           :label="`Click here to pay for your order ($${data.totalPrice})`" color="purple"/>
                  </div>
                  <div class="row">
                    <h6 class="col-xs-12 col-sm-12 col-md-4 q-my-md">
                      After paying, the tab will not close automatically. Close the tab, and enter your Transaction ID or full name here so
                      Tyler can immediately verify your order.
                    </h6>
                  </div>
                  <div class="row">
                    <q-btn class="col-12" color="secondary" label="How do I find my transaction ID?" icon="info" @click="tutorialDialog = true"/>
                    <q-input class="col-12" clearable filled color="primary" v-model="data.paymentReference"
                             label="Enter your payment reference"/>
                  </div>
                  <div class="row q-col-gutter">
                    <q-btn @click="submitPaymentReference" class="col" label="Submit" color="primary" icon="send"/>
                    <q-btn @click="cancelOrder" class="col" label="Cancel" color="negative" icon="cancel"/>
                  </div>
                </div>
                <div v-else>
                  <div class="text-h3">
                    Order is paid!
                    <q-icon name="today" class="text-orange" style="font-size: 2em;"/>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>
                  This order has been cancelled. Please contact an administrator or submit a new order.
                </p>
              </div>
              <q-dialog
                v-model="tutorialDialog"
                persistent
                :maximized="maximizedToggle"
                transition-show="slide-up"
                transition-hide="slide-down"
              >
                <q-card class="bg-primary text-white">
                  <q-bar>
                    <q-space/>

                    <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
                      <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
                      <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="close" v-close-popup>
                      <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                  </q-bar>

                  <q-card-section>
                    <div class="text-h6">How to find your payment reference</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <ul>
                      <li>
                        <div>
                          <div>
                            Go to your recent Paypal transactions:
                          </div>
                          <q-btn type="a" icon="payment" href="https://www.paypal.com/myaccount/transactions/"
                                 target="_blank" label="Recent transactions" color="secondary"/>
                        </div>
                      </li>
                      <li>
                        Click the payment you fulfilled for your order
                      </li>
                      <li>
                        Find the "Transaction ID" of this order
                      </li>
                      <li>
                        Copy this value and paste it in the Payment Reference field of your order
                      </li>
                      <li>
                        Tyler can now immediately verify your order
                      </li>
                    </ul>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
            <div v-else-if="user.isAdmin" class="col col-4">
              <div v-if="data.status !== 'cancelled'">
                <div class="full-width">
                  <div class="row text-bold">
                    <div class="col">
                      Field
                    </div>
                    <div class="col">
                      Value
                    </div>
                  </div>
                  <q-separator/>
                  <div class="row">
                    <div class="col">
                      Status
                    </div>
                    <div class="col">
                      {{ data.status }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      Payment done by customer
                    </div>
                    <div class="col">
                      <div v-if="data.status === 'paid' || data.status === 'paymentConfirmed'">
                        <q-icon name="check"/>
                      </div>
                      <div v-else>
                        <q-icon name="cancel"/>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      Payment reference
                    </div>
                    <div class="col">
                      {{ data.paymentReference ? data.paymentReference : 'N/A' }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      Payment confirmed
                    </div>
                    <div class="col">
                      <div v-if="data.status === 'paymentConfirmed'">
                        <q-icon name="check"/>
                      </div>
                      <div v-else>
                        <q-icon name="cancel"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="data.status !== 'completed'">
                  <div class="text-h4 q-mt-md">
                    Actions
                  </div>
                  <q-separator/>
                  <div>
                    <div v-if="data.status !== 'paymentConfirmed'" class="row q-gutter-md q-my-xs full-width">
                      <div>
                        <q-btn @click="declinePayment" class="col" label="Decline payment" color="info"
                               icon="report_problem"/>
                      </div>
                      <div>
                        <q-btn @click="confirmPayment" class="col" label="Confirm payment" color="positive" icon="check"/>
                      </div>
                    </div>
                    <div v-if="data.status !== 'paymentConfirmed'" class="row q-gutter-md q-my-xs full-width">
                      <div>
                        <q-btn @click="cancelOrder" class="col" label="Cancel order" color="negative" icon="cancel"/>
                      </div>
                    </div>
                    <div v-else class="row q-gutter-md q-my-xs full-width">
                      <div class="q-ml-sm">
                        <q-btn @click="cancelOrder" class="col" label="Cancel order" color="negative" icon="cancel"/>
                      </div>
                      <div>
                        <q-btn v-if="checkIfCompleteable" @click="completeOrder" class="col" label="Complete order" color="positive" icon="check"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>
                  This order has been cancelled. Please contact an administrator or submit a new order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import {Validations} from 'vuelidate-property-decorators';
import {required, minLength, maxLength} from 'vuelidate/lib/validators';

@Component({
  components: {}
})
export default class Order extends Vue {

  @Validations()
  validations = {
    data: {
      paymentReference: {
        required,
        // minLength: minLength(17),
        // maxLength: maxLength(19),
      }
    }
  }

  public tutorialDialog = false;
  public maximizedToggle = false;
  public loading = false;
  public data: any = {};
  public columns = [
    {
      align: 'left',
      name: 'product',
      label: 'Product',
      field: (row: { product_listing: { product: { name: any; }; }; }) => row.product_listing.product.name
    },
    {
      align: 'left',
      name: 'amount',
      label: 'Amount',
      field: (row: { quantity: number; product_listing: { amount: number; }; }) => row.quantity * row.product_listing.amount
    },
    {
      align: 'left',
      name: 'isCompleted',
      label: 'Fulfilled',
      field: (row: { isCompleted: boolean; }) => !!row.isCompleted
    }
  ];

  get user() {
    return this.$store.getters['auth/user'];
  }

  get checkIfCompleteable() {
    return this.data.order_lines.filter(
      // @ts-ignore
      orderLine => {
        return !orderLine.isCompleted
      })
      .length === 0
  }

  public toggleFulfillment(row: { id: any; product_listing: any; order_id: any; }) {
    const index = this.data.order_lines.findIndex((dataRow: { id: any; }) => dataRow.id === row.id);
    this.data.order_lines[index].isCompleted = !this.data.order_lines[index].isCompleted;
    this.loading = true;
    this.$axios.post(`/orders/${this.$route.params.id}/orderLine/${row.id}/toggleCompletion`).then(
      () => {
        this.fetchOrder();
        this.$q.notify({
          type: 'positive',
          message: `Succesfully updated completion of ${row.product_listing.product.name}`
        });
      }
    ).finally(
      () => {
        this.loading = false;
      }
    );
  }

  public submitPaymentReference() {
    this.$v.data.$touch();
    if (!this.$v.data.$invalid) {
      this.$q.loading.show();
      return this.$axios.post(`/orders/${this.$route.params.id}/submitPaymentReference`, {paymentReference: this.data.paymentReference}).then(
        () => {
          this.fetchOrder();
          this.$q.notify({
            type: 'positive',
            message: `Payment reference submitted`
          });
        }
      ).catch(
        (error) => {
          this.$q.notify({
            type: 'negative',
            message: error.response.data.message
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )
    } else {
      this.$q.notify({
        type: 'warning',
        message: `Payment reference is required.`
      });
    }
  }

  public fetchOrder() {
    return this.$axios.get(`/orders/${this.$route.params.id}`).then(
      response => {
        this.data = response.data;
      }
    );
  }

  public declinePayment() {
    this.$q.dialog({
      title: 'Confirm',
      message: 'Are you sure you would like to decline the customer\'s payment?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post(`/orders/${this.$route.params.id}/declinePayment`).then(
        () => {
          this.$q.notify({
            type: 'positive',
            message: 'Payment declined!'
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
          this.fetchOrder();
        }
      )
    });
  }

  public confirmPayment() {
    this.$q.dialog({
      title: 'Confirm',
      message: 'Are you sure you would like to confirm the customer\'s payment?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post(`/orders/${this.$route.params.id}/confirmPayment`).then(
        () => {
          this.$q.notify({
            type: 'positive',
            message: 'Payment confirmed!'
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
          this.fetchOrder();
        }
      )
    });
  }

  public cancelOrder() {
    this.$q.dialog({
      title: 'Confirm',
      message: 'Are you sure you would like to cancel this order?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post(`/orders/${this.$route.params.id}/cancel`).then(
        () => {
          this.$q.notify({
            type: 'positive',
            message: 'Order cancelled!'
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
          this.fetchOrder();
        }
      )
    });
  }

  public completeOrder() {
    this.$q.dialog({
      title: 'Confirm',
      message: 'Are you sure you would like to complete this order?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      this.$q.loading.show();
      this.$axios.post(`/orders/${this.$route.params.id}/complete`).then(
        () => {
          this.$q.notify({
            type: 'positive',
            message: 'Order completed!'
          });
        }
      ).finally(
        () => {
          this.$q.loading.hide();
          this.fetchOrder();
        }
      )
    });
  }


  public created() {
    this.loading = true;
    this.fetchOrder().finally(
      () => {
        this.loading = false;
      }
    );
  }
}
</script>

<style lang="scss" scoped>

</style>

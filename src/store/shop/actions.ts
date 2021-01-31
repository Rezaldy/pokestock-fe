import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ShopStateInterface } from './state';
import {Vue} from 'vue-property-decorator';

const actions: ActionTree<ShopStateInterface, StateInterface> = {
  fetchShoppingCart (context) {
    return Vue.prototype.$axios.post('shop/cart').then(
        (response: { data: any; }) => {
        context.commit('setCart', response.data);
      }
    )
  },
  clearShoppingCart (context) {
    return Vue.prototype.$axios.post('shop/cart/clear').then(
      (response: { data: any; }) => {
        context.commit('setCart', response.data);
      }
    )
  },
  submitShoppingCart (context, payload) {
    const submitPromise = Vue.prototype.$axios.post('shop/cart/submit', payload).then(
      (response: any) => {
        context.dispatch('clearShoppingCart');
      }
    );

    const fetchPromise = context.dispatch('fetchShoppingCart');

    return Promise.all([submitPromise,fetchPromise]);
  }
};

export default actions;

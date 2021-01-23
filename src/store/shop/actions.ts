import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ShopStateInterface } from './state';
import {Vue} from 'vue-property-decorator';

const actions: ActionTree<ShopStateInterface, StateInterface> = {
  fetchShoppingCart (context) {

    Vue.prototype.$axios.post('shop/cart').then(
        (response: { data: any; }) => {
        context.commit('setCart', response.data);
      }
    )
  }
};

export default actions;

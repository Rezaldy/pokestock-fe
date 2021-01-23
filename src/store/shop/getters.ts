import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ShopStateInterface } from './state';

const getters: GetterTree<ShopStateInterface, StateInterface> = {
  getCart (context: ShopStateInterface) {
    return context.cart;
  },
  getCartSize (context: ShopStateInterface) {
    return Object.keys(context.cart).length;
  },
};

export default getters;

import { MutationTree } from 'vuex';
import {CartItemInterface, ShopStateInterface} from './state';

const mutation: MutationTree<ShopStateInterface> = {
  setCart (state: ShopStateInterface, cart: CartItemInterface[]) {
    state.cart = cart;
  }
};

export default mutation;

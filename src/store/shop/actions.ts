import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ShopStateInterface } from './state';

const actions: ActionTree<ShopStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;

import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  isAuthorized (context: AuthStateInterface) {
    return context.auth;
  },
  isAdmin (context: AuthStateInterface) {
    return context.user.isAdmin;
  },
  user (context: AuthStateInterface) {
    return context.user;
  }
};

export default getters;

import { MutationTree } from 'vuex';
import { AuthStateInterface, UserInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setUser (state: AuthStateInterface, user: UserInterface) {
    state.user = user;
  },
  setAuth (state: AuthStateInterface, isAuth: boolean) {
    state.auth = isAuth;
  }
};

export default mutation;

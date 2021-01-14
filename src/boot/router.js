// Outside of default export:
//  - Code here gets executed immediately,
//  - Good place for import statements,
//  - No access to router, Vuex store, ...
import { Notify } from 'quasar';

// @ts-ignore
export default async ({ app, router, store, Vue }) => {

  // @ts-ignore
  router.beforeEach((to, from, next) => {
    if (store.getters['auth/isAuthorized']) {
      if (to.meta.requiresAdmin === true && !store.getters['auth/user'].isAdmin) {
        if (to.name !== 'dashboard') {
          Notify.create({
            type: 'negative',
            message: 'You are not authorized to view this page.',
          })
          next('dashboard');
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  });
}

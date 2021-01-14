import {RouteConfig} from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', name: 'home', component: () => import('pages/Index.vue')},
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: {requiresAdmin: true}
      },
      {path: 'products', name: 'products', component: () => import('pages/Products.vue'), meta: {requiresAdmin: true}},
      {path: 'product/:id', name: 'product', component: () => import('pages/Product.vue'), meta: {requiresAdmin: true}},
      {
        path: 'product/add',
        name: 'addProduct',
        component: () => import('pages/ProductForm.vue'),
        meta: {requiresAdmin: true}
      },
      {
        path: 'product/:id/edit',
        name: 'editProduct',
        component: () => import('pages/ProductForm.vue'),
        meta: {requiresAdmin: true}
      },
      {path: 'shop', name: 'shop', component: () => import('pages/Shop.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;

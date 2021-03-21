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
        meta: {requiresAdmin: false}
      },
      {
        path: 'termsandconditions',
        name: 'termsandconditions',
        component: () => import('pages/TermsAndConditions.vue'),
        meta: {requiresAdmin: false}
      },
      // PRODUCT MANAGEMENT
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
      // SHOP
      {path: 'shop/:category', name: 'shopCategory', component: () => import('pages/Shop.vue')},
      {path: 'shop/all', name: 'shopAll', component: () => import('pages/Shop.vue')},
      {path: 'shop', name: 'shopCategories', component: () => import('pages/ShopCategories.vue')},
      // ORDERS
      {path: 'orders', name: 'orders', component: () => import('pages/Orders.vue')},
      {path: 'order/:id', name: 'order', component: () => import('pages/Order.vue')},
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

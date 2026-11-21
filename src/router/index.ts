import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import MyOrdersView from '../views/MyOrdersView.vue';
import OrderDetailView from '../views/OrderDetailView.vue';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue')
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('../views/CartView.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order-success',
      component: () => import('../views/OrderSuccessView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order-success',
      component: () => import('../views/OrderSuccessView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/orders',
      component: MyOrdersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/orders/:id',
      component: OrderDetailView,
      meta: { requiresAuth: true }
    },
  ]
});
    router.beforeEach((to) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    return '/login';
  }

  return true;
});
export default router;
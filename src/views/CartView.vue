<script setup lang="ts">
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <div class="cart-page">
    <h1>Shopping Cart</h1>
    <button
        class="back-button"
        @click="$router.push('/')"
        >
        ← Continue Shopping
    </button>
    <div v-if="cartStore.cartItems.length === 0">
      <p>Your cart is empty.</p >
      <router-link to="/">Continue Shopping</router-link>
    </div>

    <div v-else>
      <div
        v-for="item in cartStore.cartItems"
        :key="item.id"
        class="cart-item"
      >
        <img
        :src="item.image_url"
        :alt="item.name"
        >

        <div>
          <h3>{{ item.name }}</h3>
          <p>${{ item.price }}</p >
          <div class="quantity-control">
  <button
    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
    :disabled="item.quantity <= 1"
  >
    -
  </button>

  <span>{{ item.quantity }}</span>

  <button
    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
  >
    +
  </button>
    </div>
    <button
    class="remove-button"
    @click="cartStore.removeFromCart(item.id)"
    >
    Remove
    </button>
        </div>
      </div>

      <h2>
        Total: ${{ cartStore.totalPrice.toFixed(2) }}
      </h2>
        <button
            class="checkout-button"
            @click="$router.push('/checkout')"
            >
            Proceed to Checkout
        </button>
    </div>
  </div>
</template>

<style scoped>

.cart-page {
  min-height: 100vh;
  padding: 50px 7%;
  background: #f5f7fa;
  color: #111827;
  max-width: 1500px;
  margin: 0 auto;
}

.cart-page h1 {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

/* 继续购物 */
.back-button {
  margin: 15px 0 30px;
  padding: 10px 16px;
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  color: #2563eb;
  border-color: #2563eb;
  transform: translateX(-3px);
}

/* 商品列表 */
.cart-page > div:last-child {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 18px;
  padding: 25px 30px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.035);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 24px 0;
  border-bottom: 1px solid #edf0f5;
}

.cart-item img {
  width: 125px;
  height: 125px;
  padding: 12px;
  object-fit: contain;
  background: #f1f5f9;
  border-radius: 13px;
}

.cart-item h3 {
  color: #1e293b;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
}

.cart-item p {
  margin-top: 8px;
  color: #2563eb;
  font-size: 17px;
  font-weight: 700;
}

/* 数量控制 */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 14px;
  width: fit-content;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-control button {
  width: 36px;
  height: 34px;
  border: none;
  background: #f8fafc;
  color: #334155;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}

.quantity-control button:hover:not(:disabled) {
  background: #dbeafe;
  color: #2563eb;
}

.quantity-control button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 42px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
}

/* 删除商品 */
.remove-button {
  margin-top: 13px;
  padding: 0;
  border: none;
  background: none;
  color: #ef4444;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.remove-button:hover {
  color: #b91c1c;
  text-decoration: underline;
}

/* 总金额 */
.cart-page h2 {
  margin-top: 28px;
  color: #111827;
  font-size: 25px;
  font-weight: 800;
  text-align: right;
}

/* 结算按钮 */
.checkout-button {
  display: block;
  width: 240px;
  margin: 20px 0 0 auto;
  padding: 15px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18);
}

.checkout-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

/* 空购物车 */
.cart-page > div:has(> p) {
  margin-top: 20px;
  padding: 65px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 18px;
}

.cart-page > div:has(> p) p {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 20px;
}

.cart-page > div:has(> p) a {
  display: inline-block;
  padding: 12px 22px;
  color: #fff;
  background: #2563eb;
  border-radius: 9px;
  text-decoration: none;
  font-weight: 600;
}

/* 手机端 */
@media (max-width: 768px) {
  .cart-page {
    padding: 30px 5%;
  }

  .cart-page h1 {
    font-size: 28px;
  }

  .cart-page > div:last-child {
    padding: 18px;
  }

  .cart-item {
    gap: 15px;
    align-items: flex-start;
  }

  .cart-item img {
    width: 95px;
    height: 95px;
  }

  .cart-item h3 {
    font-size: 15px;
  }

  .cart-page h2 {
    font-size: 21px;
  }

  .checkout-button {
    width: 100%;
  }
}

</style>
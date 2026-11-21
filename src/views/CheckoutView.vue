<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { createOrder } from '../api/order';
import { showToast } from '../composables/useToast';

const cartStore = useCartStore();
const router = useRouter();

// 收货人信息
const fullName = ref('');
const phone = ref('');
const address = ref('');
const submitting = ref(false);
// 提交订单
// 提交订单
const submitOrder = async () => {
  if (submitting.value) return;
  // 检查收货信息
  if (!fullName.value || !phone.value || !address.value) {
    showToast('Please complete all shipping information!', 'error');
    return;
  }

  // 检查购物车
  if (cartStore.cartItems.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

submitting.value = true;

  try {
    // 组织订单数据
    const orderData = {
      recipientName: fullName.value,
      phone: phone.value,
      shippingAddress: address.value,
      items: cartStore.cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
        }))
    };

    // 发送订单请求
    const response = await createOrder(orderData);

    // 清空购物车
    cartStore.clearCart();

    // 跳转到订单成功页面
    router.push({
    path: '/order-success',
    query: {
        orderId: response.data.orderId
    }
    });


  } catch (error) {
    console.error('Order submission failed:', error);
    showToast('Failed to create order. Please try again.', 'error');
  } finally {
    submitting.value = false;
  }
};
</script>
<template>
  <div class="checkout-page">
  <button class="back-button" @click="router.push('/cart')">
    ← Back to Cart
  </button>

  <h1>Checkout</h1>
    <p>Complete your order below.</p >

        <div class="order-summary">
  <h2>Order Summary</h2>

  <div
  v-for="item in cartStore.cartItems"
  :key="item.id"
  class="order-item"
>
  <img
    :src="item.image_url"
    :alt="item.name"
    class="order-item-image"
  >

  <div class="order-item-info">
    <h3>{{ item.name }}</h3>
    <p>Quantity: {{ item.quantity }}</p>
  </div>

  <span>
    ${{ (Number(item.price) * item.quantity).toFixed(2) }}
  </span>
</div>

  <div class="order-total">
    <span>Total</span>
    <strong>${{ cartStore.totalPrice.toFixed(2) }}</strong>
  </div>
</div>
<form class="checkout-form">
  <h2>Shipping Information</h2>

  <div class="form-group">
    <label>Full Name</label>
    <input
    v-model="fullName"
    type="text"
    placeholder="Enter your full name"
    />
  </div>

  <div class="form-group">
    <label>Phone Number</label>
    <input
      type="tel"
      placeholder="Enter your phone number"
      v-model="phone"
    />
  </div>

  <div class="form-group">
    <label>Shipping Address</label>
    <textarea
      placeholder="Enter your shipping address"
      rows="4"
      v-model="address"
    ></textarea>
  </div>
    <button
        type="button"
        class="submit-button"
        @click="submitOrder"
        :disabled="submitting"
    >
        {{ submitting ? 'Processing...' : 'Place Order' }}
    </button>
</form>
  </div>
</template>
<style scoped>

.checkout-page {
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 55px 6%;
  color: #111827;
  background: #f5f7fa;
}

/* 页面标题 */
.checkout-page > h1 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.checkout-page > p {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 35px;
}

/* 收货表单和订单汇总 */
.checkout-page {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: auto auto 1fr;
  column-gap: 30px;
  align-content: start;
}

.checkout-page > h1,
.checkout-page > p {
  grid-column: 1 / -1;
}

/* 收货信息卡片 */
.checkout-form {
  grid-column: 1;
  grid-row: 3;
  margin-top: 0;
  max-width: none;
  padding: 32px;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.035);
}

.checkout-form h2 {
  font-size: 21px;
  font-weight: 750;
  margin-bottom: 28px;
}

/* 输入框 */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 23px;
}

.form-group label {
  margin-bottom: 9px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 15px;
  border: 1px solid #dbe2ea;
  border-radius: 9px;
  background: #f8fafc;
  color: #111827;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 110px;
}

/* 提交订单 */
.submit-button {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
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

.submit-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.23);
}

.submit-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-button:active {
  transform: translateY(0);
}

/* 订单汇总 */
.order-summary {
  grid-column: 2;
  grid-row: 3;
  align-self: start;
  position: sticky;
  top: 25px;
  max-width: none;
  margin: 0;
  padding: 30px;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.035);
}

.order-summary h2 {
  font-size: 21px;
  font-weight: 750;
  margin-bottom: 22px;
}

/* 订单商品 */
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 17px 0;
  border-bottom: 1px solid #edf0f5;
}

.order-item h3 {
  color: #334155;
  font-size: 14px;
  font-weight: 650;
  margin-bottom: 7px;
}

.order-item p {
  color: #94a3b8;
  font-size: 13px;
}

.order-item span {
  color: #1e293b;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

/* 总金额 */
.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  font-size: 16px;
  color: #475569;
}

.order-total strong {
  color: #2563eb;
  font-size: 26px;
  font-weight: 800;
}

/* 平板和手机 */
@media (max-width: 850px) {
  .checkout-page {
    display: flex;
    flex-direction: column;
    padding: 35px 5%;
    gap: 22px;
  }

  .checkout-page > h1 {
    font-size: 30px;
  }

  .checkout-page > p {
    margin-bottom: 8px;
  }

  .checkout-form,
  .order-summary {
    width: 100%;
    box-sizing: border-box;
    padding: 24px;
  }

  .order-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 480px) {
  .checkout-page {
    padding: 28px 4%;
  }

  .checkout-form,
  .order-summary {
    padding: 20px;
  }

  .checkout-form h2,
  .order-summary h2 {
    font-size: 19px;
  }

  .order-total strong {
    font-size: 23px;
  }
}
.back-button {
  grid-column: 1 / -1;
  justify-self: start;
  padding: 10px 16px;
  margin-bottom: 5px;
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
.order-item-image {
  width: 70px;
  height: 70px;
  padding: 6px;
  flex-shrink: 0;
  object-fit: contain;
  background: #f1f5f9;
  border-radius: 10px;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}
</style>
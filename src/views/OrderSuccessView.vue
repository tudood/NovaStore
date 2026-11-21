
<template>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">
        <span>✓</span>
      </div>

      <div class="success-badge">PAYMENT CONFIRMED</div>

      <h1>Order Placed Successfully!</h1>

      <p class="success-description">
        Thank you for your purchase. Your order has been received
        and is being processed.
      </p>

      <div class="order-info">
        <span>ORDER NUMBER</span>
        <strong>#{{ orderId }}</strong>
      </div>

      <div class="success-actions">
        <button
          class="primary-button"
          @click="$router.push('/orders')"
        >
          View My Orders
        </button>

        <button
          class="secondary-button"
          @click="$router.push('/')"
        >
          Continue Shopping
        </button>
      </div>

      <p class="bottom-tip">
        Thank you for choosing NovaStore.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const orderId = route.query.orderId;
</script>

<style scoped>

.success-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  background:
    radial-gradient(circle at 50% 0%, #e8f0ff 0%, transparent 45%),
    #f5f7fa;
}

.success-card {
  width: 100%;
  max-width: 560px;
  padding: 55px 45px;
  background: #fff;
  border: 1px solid #e8edf5;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.07);
  animation: fadeIn 0.5s ease;
}

.success-icon {
  width: 82px;
  height: 82px;
  margin: 0 auto 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  box-shadow: 0 0 0 10px #f0fdf4;
}

.success-icon span {
  font-size: 46px;
  font-weight: 700;
}

.success-badge {
  display: inline-block;
  margin-bottom: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.success-card h1 {
  margin-bottom: 14px;
  color: #111827;
  font-size: 28px;
  font-weight: 800;
}

.success-description {
  max-width: 390px;
  margin: 0 auto 28px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.8;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  margin-bottom: 28px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
}

.order-info span {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.order-info strong {
  color: #2563eb;
  font-size: 23px;
  letter-spacing: 1px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.success-actions button {
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button {
  border: none;
  background: #2563eb;
  color: #fff;
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.2);
}

.secondary-button {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
}

.secondary-button:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #f8faff;
}

.bottom-tip {
  margin-top: 28px;
  color: #94a3b8;
  font-size: 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .success-card {
    padding: 40px 22px;
  }

  .success-card h1 {
    font-size: 23px;
  }
}
</style>
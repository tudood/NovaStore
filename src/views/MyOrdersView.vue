
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMyOrders } from '../api/order';

const router = useRouter();

const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

const fetchOrders = async () => {
  try {
    const response = await getMyOrders();
    orders.value = response.data.orders;
    console.log('我的订单数据：', response.data.orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    error.value = 'Failed to load orders';
  } finally {
    loading.value = false;
  }
};

const viewDetails = (id: number) => {
  router.push(`/orders/${id}`);
};

onMounted(() => {
  fetchOrders();
});
</script>


<template>
  <div class="orders-page">
    <div class="orders-container">
      <div class="page-header">
        <div>
          <span class="eyebrow">ACCOUNT CENTER</span>
          <h1>My Orders</h1>
          <p class="page-description">
            Track and manage all your NovaStore purchases.
          </p>
        </div>

        <button class="back-button" @click="router.push('/')">
          ← Back to Home
        </button>
      </div>

      <div v-if="!loading && !error" class="orders-overview">
        <div class="overview-card">
          <span>Total Orders</span>
          <strong>{{ orders.length }}</strong>
        </div>

        <div class="overview-card">
          <span>Order Center</span>
          <strong>NovaStore</strong>
        </div>
      </div>

      <div v-if="loading" class="state-card">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <div v-else-if="error" class="state-card error-state">
        <div class="state-icon">!</div>
        <h3>Unable to Load Orders</h3>
        <p>{{ error }}</p>
        <button class="primary-button" @click="fetchOrders">
          Try Again
        </button>
      </div>

      <div v-else-if="orders.length === 0" class="state-card">
        <div class="state-icon">📦</div>
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders. Let's find something you love.</p>
        <button class="primary-button" @click="router.push('/')">
          Start Shopping
        </button>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div>
              <span class="order-label">ORDER NUMBER</span>
              <h3>#{{ order.id }}</h3>
            </div>

            <span :class="['status-tag', order.status]">
              {{ order.status }}
            </span>
          </div>

          <div class="order-divider"></div>
          <!-- 订单商品列表 -->

        <div class="order-items">
        <div
            v-for="item in order.items"
            :key="item.product_id"
            class="order-product"
        >
            <img
            :src="item.image_url"
            :alt="item.name"
            class="order-product-image"
            >

            <div class="order-product-info">
            <strong>{{ item.name }}</strong>
            <span>Quantity: {{ item.quantity }}</span>
            </div>

            <span class="order-product-price">
            ${{ (Number(item.price) * item.quantity).toFixed(2) }}
            </span>
        </div>
        </div>

          <div class="order-details">
            <div class="detail-item">
              <span>Recipient</span>
              <strong>{{ order.recipient_name }}</strong>
            </div>

            <div class="detail-item">
              <span>Order Date</span>
              <strong>{{ new Date(order.created_at).toLocaleString() }}</strong>
            </div>

            <div class="detail-item total-item">
              <span>Total Amount</span>
              <strong>
                ${{ Number(order.total_amount).toFixed(2) }}
              </strong>
            </div>
          </div>

          <div class="order-footer">
            <span class="order-note">
              Thank you for shopping with NovaStore
            </span>

            <button
              class="details-button"
              @click="viewDetails(order.id)"
            >
              View Details <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.orders-page {
  min-height: 100vh;
  padding: 55px 30px 80px;
  background: #f5f7fa;
  color: #111827;
}

.orders-container {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 35px;
}

.eyebrow {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-header h1 {
  margin: 10px 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
}

.page-description {
  color: #64748b;
  font-size: 14px;
}

.back-button {
  padding: 11px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  color: #2563eb;
  border-color: #2563eb;
  transform: translateX(-3px);
}

.orders-overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.overview-card {
  padding: 22px 25px;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.025);
}

.overview-card span {
  display: block;
  margin-bottom: 10px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.overview-card strong {
  color: #111827;
  font-size: 24px;
  font-weight: 800;
}

.orders-list {
  display: grid;
  gap: 18px;
}

.order-card {
  padding: 25px 28px;
  border: 1px solid #e8edf5;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.025);
  transition: all 0.25s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  border-color: #d5e2ff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.order-label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.order-header h3 {
  margin-top: 6px;
  color: #111827;
  font-size: 20px;
  font-weight: 800;
}

.order-divider {
  height: 1px;
  margin: 22px 0;
  background: #edf0f5;
}

.order-details {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}

.detail-item span {
  color: #94a3b8;
  font-size: 12px;
}

.detail-item strong {
  overflow-wrap: anywhere;
  color: #334155;
  font-size: 14px;
  font-weight: 650;
}

.total-item strong {
  color: #2563eb;
  font-size: 20px;
  font-weight: 800;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 13px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: capitalize;
}

.status-tag.pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-tag.paid {
  background: #dcfce7;
  color: #15803d;
}

.status-tag.shipped {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-tag.completed {
  background: #d1fae5;
  color: #047857;
}

.status-tag.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding-top: 20px;
  margin-top: 22px;
  border-top: 1px solid #edf0f5;
}

.order-note {
  color: #94a3b8;
  font-size: 11px;
}

.details-button,
.primary-button {
  padding: 11px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.details-button:hover,
.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.details-button span {
  margin-left: 5px;
  font-size: 15px;
}

.state-card {
  padding: 65px 25px;
  border: 1px solid #e8edf5;
  border-radius: 16px;
  background: #fff;
  text-align: center;
}

.state-icon {
  margin-bottom: 15px;
  font-size: 38px;
}

.state-card h3 {
  margin-bottom: 10px;
  color: #111827;
  font-size: 20px;
}

.state-card p {
  margin-bottom: 22px;
  color: #64748b;
  font-size: 14px;
}

.error-state .state-icon {
  color: #dc2626;
  font-weight: 800;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  margin: 0 auto 18px;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 700px) {
  .orders-page {
    padding: 35px 18px 60px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .orders-overview {
    grid-template-columns: 1fr 1fr;
  }

  .order-details {
    grid-template-columns: 1fr 1fr;
  }

  .total-item {
    grid-column: 1 / -1;
  }

  .order-card {
    padding: 22px 18px;
  }
}

@media (max-width: 420px) {
  .orders-overview {
    grid-template-columns: 1fr;
  }

  .order-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
.order-items {
  display: grid;
  gap: 14px;
  margin: 22px 0;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: #f8fafc;
}

.order-product-image {
  width: 76px;
  height: 76px;
  padding: 6px;
  flex-shrink: 0;
  object-fit: contain;
  background: #fff;
  border-radius: 9px;
}

.order-product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.order-product-info strong {
  color: #334155;
  font-size: 14px;
}

.order-product-info span {
  color: #94a3b8;
  font-size: 12px;
}

.order-product-price {
  color: #2563eb;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}
</style>



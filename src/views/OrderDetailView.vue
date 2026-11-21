
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getOrderDetail } from '../api/order';

const route = useRoute();
const router = useRouter();

const order = ref<any>(null);
const items = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

const fetchOrderDetail = async () => {
  try {
    const orderId = Number(route.params.id);
    const response = await getOrderDetail(orderId);

    order.value = response.data.order;
    items.value = response.data.items;
  } catch (err) {
    console.error('Failed to fetch order details:', err);
    error.value = 'Failed to load order details';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrderDetail();
});
</script>


<template>
  <div class="order-detail-page">
    <div class="detail-container">
      <div class="page-header">
        <div>
          <span class="eyebrow">ACCOUNT CENTER</span>
          <h1>Order Details</h1>
          <p class="page-description">
            Review your purchase and shipping information.
          </p>
        </div>

        <button class="back-button" @click="router.push('/orders')">
          ← Back to My Orders
        </button>
      </div>

      <div v-if="loading" class="state-card">
        <div class="loading-spinner"></div>
        <p>Loading order details...</p>
      </div>

      <div v-else-if="error" class="state-card error-state">
        <div class="state-icon">!</div>
        <h3>Unable to Load Order</h3>
        <p>{{ error }}</p>
        <button class="primary-button" @click="fetchOrderDetail">
          Try Again
        </button>
      </div>

      <div v-else-if="order">
        <div class="order-top-card">
          <div>
            <span class="order-label">ORDER NUMBER</span>
            <h2>#{{ order.id }}</h2>
            <p class="created-time">
              Placed on {{ new Date(order.created_at).toLocaleString() }}
            </p>
          </div>

          <span :class="['status-tag', order.status]">
            {{ order.status }}
          </span>
        </div>

        <div class="detail-layout">
          <section class="content-card items-card">
            <div class="section-heading">
              <div>
                <span class="section-label">PURCHASE DETAILS</span>
                <h3>Order Items</h3>
              </div>
              <span class="item-count">{{ items.length }} items</span>
            </div>

            <div
              v-for="item in items"
              :key="item.product_id"
              class="product-item"
            >
                <img
                :src="item.image_url"
                :alt="item.name"
                class="product-image"
                >

              <div class="product-info">
                <h4>{{ item.name }}</h4>
                <p>Quantity: {{ item.quantity }}</p>
              </div>

              <div class="product-price">
                ${{ Number(item.price).toFixed(2) }}
              </div>
            </div>

            <div class="items-total">
              <span>Order Total</span>
              <strong>
                ${{ Number(order.total_amount).toFixed(2) }}
              </strong>
            </div>
          </section>

          <div class="right-column">
            <section class="content-card summary-card">
              <span class="section-label">ORDER SUMMARY</span>
              <h3>Payment Overview</h3>

              <div class="summary-row">
                <span>Items</span>
                <strong>{{ items.length }}</strong>
              </div>

              <div class="summary-row">
                <span>Order Status</span>
                <strong class="summary-status">{{ order.status }}</strong>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-total">
                <span>Total Amount</span>
                <strong>
                  ${{ Number(order.total_amount).toFixed(2) }}
                </strong>
              </div>
            </section>

            <section class="content-card shipping-card">
              <span class="section-label">DELIVERY INFORMATION</span>
              <h3>Shipping Details</h3>

              <div class="shipping-field">
                <span>Recipient</span>
                <strong>{{ order.recipient_name }}</strong>
              </div>

              <div class="shipping-field">
                <span>Phone Number</span>
                <strong>{{ order.phone }}</strong>
              </div>

              <div class="shipping-field">
                <span>Shipping Address</span>
                <strong>{{ order.shipping_address }}</strong>
              </div>
            </section>
          </div>
        </div>

        <div class="bottom-actions">
          <button
            class="primary-button"
            @click="router.push('/orders')"
          >
            ← Back to My Orders
          </button>

          <button
            class="secondary-button"
            @click="router.push('/')"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.order-detail-page {
  min-height: 100vh;
  padding: 50px 30px 80px;
  background: #f5f7fa;
  color: #111827;
}

.detail-container {
  max-width: 1150px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.eyebrow,
.section-label {
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.page-header h1 {
  margin: 9px 0;
  font-size: 32px;
  font-weight: 800;
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

.order-top-card,
.content-card,
.state-card {
  border: 1px solid #e8edf5;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.025);
}

.order-top-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 28px;
  margin-bottom: 22px;
}

.order-label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.order-top-card h2 {
  margin: 7px 0;
  font-size: 24px;
  font-weight: 800;
}

.created-time {
  color: #94a3b8;
  font-size: 12px;
}

.status-tag {
  display: inline-flex;
  padding: 7px 14px;
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

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr);
  gap: 22px;
  align-items: start;
}

.content-card {
  padding: 25px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.content-card h3 {
  margin-top: 8px;
  margin-bottom: 20px;
  color: #111827;
  font-size: 19px;
  font-weight: 800;
}

.section-heading h3 {
  margin-bottom: 0;
}

.item-count {
  color: #94a3b8;
  font-size: 12px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 0;
  border-top: 1px solid #edf0f5;
}

.product-image {
  width: 65px;
  height: 65px;
  padding: 6px;
  flex-shrink: 0;
  object-fit: contain;
  border-radius: 11px;
  background: #f8fafc;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h4 {
  margin-bottom: 7px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.product-info p {
  color: #94a3b8;
  font-size: 12px;
}

.product-price {
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.items-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 22px;
  margin-top: 10px;
  border-top: 1px solid #e8edf5;
}

.items-total span {
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.items-total strong {
  color: #2563eb;
  font-size: 23px;
  font-weight: 900;
}

.right-column {
  display: grid;
  gap: 22px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0;
  color: #64748b;
  font-size: 13px;
}

.summary-row strong {
  color: #334155;
  text-transform: capitalize;
}

.summary-status {
  color: #2563eb !important;
}

.summary-divider {
  height: 1px;
  margin: 20px 0;
  background: #edf0f5;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.summary-total span {
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}

.summary-total strong {
  color: #2563eb;
  font-size: 21px;
  font-weight: 900;
}

.shipping-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 13px 0;
  border-top: 1px solid #edf0f5;
}

.shipping-field span {
  color: #94a3b8;
  font-size: 11px;
}

.shipping-field strong {
  color: #334155;
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.bottom-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.primary-button,
.secondary-button {
  padding: 12px 20px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button {
  border: none;
  background: #2563eb;
  color: #fff;
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.secondary-button {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
}

.secondary-button:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.state-card {
  padding: 65px 25px;
  text-align: center;
}

.state-card p {
  margin: 15px 0;
  color: #64748b;
  font-size: 14px;
}

.state-icon {
  color: #dc2626;
  font-size: 35px;
  font-weight: 800;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  margin: 0 auto;
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

@media (max-width: 800px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .order-detail-page {
    padding: 35px 18px 60px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-top-card {
    padding: 22px 18px;
  }

  .content-card {
    padding: 20px 17px;
  }

  .bottom-actions {
    flex-direction: column;
  }

  .bottom-actions button {
    width: 100%;
  }
}
</style>

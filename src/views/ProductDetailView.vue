<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProduct } from '../api/product';
import { showToast } from '../composables/useToast';

// 获取当前路由
const route = useRoute();
const cartStore = useCartStore();
const router = useRouter();

// 商品数据
const product = ref<any>(null);

// 加载状态
const loading = ref(false);

// 商品数量
const quantity = ref(1);

// 获取商品详情
const fetchProduct = async () => {
  loading.value = true;

  try {
    const id = Number(route.params.id);

    const response = await getProduct(id);

    product.value = response.data.data;

  } catch (error) {
    console.error('商品详情获取失败：', error);
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};
// 加入购物车
const handleAddToCart = () => {
  if (!product.value) return;

  cartStore.addToCart(product.value, quantity.value);

  showToast('Added to cart successfully!', 'success');
};

// 页面加载时获取商品
onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="detail-page">

    <button class="back-button" @click="goBack">
      ← Back
    </button>

    <div v-if="loading">
      Loading product...
    </div>

    <div v-else-if="product" class="product-detail">

      <div class="product-image">
          <img
          :src="product.image_url"
          :alt="product.name"
          >
      </div>

      <div class="product-info">

        <p class="tag">NOVA COLLECTION</p >

        <h1>{{ product.name }}</h1>

        <p class="description">
          {{ product.description }}
        </p >

        <h2 class="price">
          ${{ product.price }}
        </h2>

        <p class="stock">
          Stock: {{ product.stock }}
        </p >

        <div class="quantity-box">
          <button
            @click="quantity > 1 && quantity--"
          >
            -
          </button>

          <span>{{ quantity }}</span>

          <button
            @click="quantity < product.stock && quantity++"
          >
            +
          </button>
        </div>

        <button class="add-cart" @click="handleAddToCart">
          Add to Cart
        </button>
<router-link to="/cart">Go to Cart</router-link>
      </div>
    </div>

    <div v-else>
      Product not found.
    </div>

  </div>
</template>

<style scoped>

.detail-page {
  min-height: 100vh;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 6%;
  color: #111827;
  background: #f5f7fa;
}

/* 返回按钮 */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 35px;
  transition: all 0.2s;
}

.back-button:hover {
  color: #2563eb;
  border-color: #2563eb;
  transform: translateX(-3px);
}

/* 商品主体 */
.product-detail {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 70px;
  align-items: center;
  background: #fff;
  padding: 45px;
  border: 1px solid #e8edf4;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.04);
}

/* 商品图片 */
.product-image {
  background: linear-gradient(145deg, #f1f5f9, #e8eef7);
  border-radius: 16px;
  padding: 35px;
  overflow: hidden;
}

.product-image img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  mix-blend-mode: multiply;
  transition: transform 0.4s ease;
}

.product-image:hover img {
  transform: scale(1.05);
}

/* 商品信息 */
.product-info {
  padding: 15px 5px;
}

.tag {
  display: inline-block;
  color: #2563eb;
  background: #eff6ff;
  letter-spacing: 2px;
  font-size: 11px;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 22px;
}

.product-info h1 {
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.2;
  letter-spacing: -1.5px;
  font-weight: 800;
  margin-bottom: 22px;
}

.description {
  color: #64748b;
  font-size: 15px;
  line-height: 1.9;
  margin-bottom: 25px;
}

.price {
  color: #2563eb;
  font-size: 36px;
  font-weight: 800;
  margin: 25px 0;
}

.stock {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 25px;
}

/* 数量选择 */
.quantity-box {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  margin-bottom: 25px;
}

.quantity-box button {
  width: 42px;
  height: 42px;
  border: none;
  background: #f8fafc;
  color: #334155;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.quantity-box button:hover {
  background: #e2e8f0;
}

.quantity-box span {
  min-width: 48px;
  text-align: center;
  font-weight: 700;
}

/* 加入购物车 */
.add-cart {
  display: block;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18);
}

.add-cart:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25);
}

/* 购物车链接 */
.product-info > a {
  display: inline-block;
  margin-top: 18px;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.product-info > a:hover {
  color: #2563eb;
}

/* 加载与异常状态 */
.detail-page > div[v-if],
.detail-page > div[v-else] {
  color: #64748b;
  padding: 50px 0;
  text-align: center;
}

/* 手机端 */
@media (max-width: 768px) {
  .detail-page {
    padding: 25px 5%;
  }

  .product-detail {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 22px;
  }

  .product-image {
    padding: 20px;
  }

  .product-info h1 {
    font-size: 28px;
  }

  .price {
    font-size: 30px;
  }
}

</style>
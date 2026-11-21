<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { getProducts } from '../api/product';
import { useCartStore } from '../stores/cart';
import { useUserStore } from '../stores/user';
import { showToast } from '../composables/useToast';
// 商品数据
const products = ref<any[]>([]);
const loading = ref(false);
const cartStore = useCartStore();
const userStore = useUserStore();
const handleLogout = () => {
  userStore.logout();
  showToast('Logged out successfully!', 'success');
};
// 当前选中的分类
const activeCategory = ref('All');
//定义搜索变量
const searchKeyword = ref('');
//当前排序方式
const sortOrder = ref('default');
// 商品分类
const categories = [
  { name: 'Headphones', icon: '🎧' },
  { name: 'Keyboards', icon: '⌨️' },
  { name: 'Speakers', icon: '🔊' },
  { name: 'Accessories', icon: '🖱️' }
];
// 获取商品
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts();
    products.value = response.data.data;
  } catch (error) {
    console.error('商品获取失败：', error);
  } finally {
    loading.value = false;
  }
};
// 根据分类筛选商品
const filteredProducts = computed(() => {
  // 先筛选分类
  let result = products.value;

  if (activeCategory.value !== 'All') {
    const categoryMap: Record<string, number> = {
      Headphones: 1,
      Keyboards: 2,
      Speakers: 3,
      Accessories: 4
    };

    result = result.filter(
      product =>
        Number(product.category_id) === categoryMap[activeCategory.value]
    );
  }

  // 再筛选搜索关键词
  if (searchKeyword.value.trim()) {
    result = result.filter(product =>
      product.name
        .toLowerCase()
        .includes(searchKeyword.value.trim().toLowerCase())
    );
  }
// 根据价格排序
if (sortOrder.value === 'asc') {
  result = [...result].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );
}

if (sortOrder.value === 'desc') {
  result = [...result].sort(
    (a, b) => Number(b.price) - Number(a.price)
  );
}
  return result;
});
// 页面加载时获取商品
onMounted(() => {
  fetchProducts();
});
</script>
<template>
  <div class="page">
<!-- 顶部导航 -->
<header class="navbar">
  <div class="logo">NOVA<span>STORE</span></div>
  <nav>
    <a href=" ">Home</a >
    <a href="#categories">Categories</a >
    <a href="#products">Products</a >
  </nav>
  <button
    class="cart-button"
    @click="$router.push('/cart')"
  >
    🛒
    <span class="cart-count" v-if="cartStore.totalCount > 0">
      {{ cartStore.totalCount }}
    </span>
</button>
  <div v-if="userStore.isLoggedIn" class="user-info">
    <span>Welcome, {{ userStore.user?.username }}</span>
    <button @click="$router.push('/orders')">
      My Orders
    </button>
    <button @click="handleLogout">Logout</button>
  </div>

  <router-link v-else to="/login" class="login-link">
    Sign In
  </router-link>
</header>
<!-- 主视觉区域 -->
<section class="hero">
  <div class="hero-content">
    <p class="hero-tag">DISCOVER THE FUTURE</p >
    <h1>Technology<br>Made Simple.</h1>
    <p class="hero-description">
      Discover premium electronics designed
      to elevate your everyday life.
    </p >
    <a href="#products" class="shop-button">
      Explore Products →
    </a >
  </div>
  <div class="hero-decoration">
    <div class="hero-circle">N</div>
  </div>
</section>
<!-- 商品分类 -->
<section class="categories section" id="categories">
  <div class="section-heading">
    <div>
      <p class="section-tag">EXPLORE OUR COLLECTION</p >
      <h2>Shop by Category</h2>
    </div>
  </div>
  <div class="category-list">
    <!-- 全部商品 -->
    <div
      class="category-card"
      :class="{ active: activeCategory === 'All' }"
      @click="activeCategory = 'All'"
    >
      <span>✨</span>
      <h3>All Products</h3>
    </div>
    <!-- 其他分类 -->
    <div
      class="category-card"
      v-for="category in categories"
      :key="category.name"
      :class="{ active: activeCategory === category.name }"
      @click="activeCategory = category.name"
    >
      <span>{{ category.icon }}</span>
      <h3>{{ category.name }}</h3>
    </div>
  </div>
</section>
<!-- 商品列表 -->
<section class="products section" id="products">
  <!-- 商品搜索 -->
<div class="search-box">
  <input
    type="text"
    v-model="searchKeyword"
    placeholder="Search products..."
  />
</div>
<select v-model="sortOrder" class="sort-select">
  <option value="default">Default Sorting</option>
  <option value="asc">Price: Low to High</option>
  <option value="desc">Price: High to Low</option>
</select>
  <div class="section-heading">
    <div>
      <p class="section-tag">OUR PRODUCTS</p >
      <h2>Featured Products</h2>
    </div>
    <span>{{ filteredProducts.length }} Products</span>
  </div>
  <div v-if="loading" class="status-message">
    Loading products...
  </div>
  <div v-else-if="filteredProducts.length === 0" class="status-message">
    No products found.
  </div>
  <div v-else class="product-list">
    <div
      class="product-card"
      v-for="product in filteredProducts"
      :key="product.id"
      @click="$router.push(`/product/${product.id}`)"
    >
      <div class="product-image">
        <img
          :src="product.image_url"
          :alt="product.name"
        >
      </div>
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p >
        <div class="product-bottom">
          <strong>${{ product.price }}</strong>
          <button>+</button>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- 页脚 -->
<footer class="footer">
  <div class="logo">NOVA<span>STORE</span></div>
  <p>Technology Made Simple.</p >
  <small>© 2026 NovaStore. All rights reserved.</small>
</footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  color: #111827;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.page * {
  box-sizing: border-box;
}

.page a {
  text-decoration: none;
  color: inherit;
}

/* 顶部导航 */
.navbar {
  min-height: 76px;
  padding: 12px 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e5eaf2;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
}

.logo {
  font-size: 25px;
  font-weight: 850;
  letter-spacing: -1.5px;
  white-space: nowrap;
}

.logo span {
  color: #2563eb;
  font-weight: 500;
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.navbar nav a {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar nav a:hover {
  color: #2563eb;
}

.cart-button,
.user-info button,
.login-link {
  border: none;
  border-radius: 9px;
  background: #111827;
  color: white;
  padding: 11px 17px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cart-button:hover,
.user-info button:hover,
.login-link:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.cart-button {
  position: relative;
  font-size: 18px;
}

.cart-count {
  position: absolute;
  top: -7px;
  right: -7px;
  background: #2563eb;
  color: white;
  font-size: 11px;
  min-width: 19px;
  height: 19px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  flex-shrink: 0;
}

.user-info span {
  font-weight: 600;
  color: #334155;
}

/* 首页主视觉 */
.hero {
  min-height: 510px;
  padding: 85px 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  background:
    radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.3), transparent 32%),
    linear-gradient(125deg, #0b1220, #111c35 65%, #172b50);
  color: white;
  overflow: hidden;
}

.hero-content {
  max-width: 560px;
  position: relative;
  z-index: 1;
}

.hero-tag,
.section-tag {
  font-size: 12px;
  letter-spacing: 3px;
  color: #60a5fa;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: clamp(46px, 6vw, 76px);
  line-height: 1.05;
  letter-spacing: -3px;
  font-weight: 850;
}

.hero-description {
  color: #cbd5e1;
  line-height: 1.9;
  margin: 25px 0 32px;
  max-width: 390px;
  font-size: 15px;
}

.shop-button {
  display: inline-block;
  background: #2563eb;
  color: white !important;
  padding: 15px 27px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.25s;
}

.shop-button:hover {
  background: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.35);
}

.hero-decoration {
  width: 310px;
  height: 310px;
  flex-shrink: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #2563eb 0%, #1d4ed8 35%, #142c57 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 100px rgba(37, 99, 235, 0.35);
}

.hero-circle {
  width: 210px;
  height: 210px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 105px;
  font-weight: 800;
}

/* 通用区域 */
.section {
  padding: 85px 10%;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
}

.section-heading h2 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
}

.section-heading > span {
  color: #64748b;
  font-size: 14px;
}

/* 商品分类 */
.category-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.category-card {
  background: white;
  padding: 30px 15px;
  text-align: center;
  border: 1px solid #e5eaf2;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.25s;
}

.category-card span {
  font-size: 35px;
}

.category-card h3 {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 650;
}

.category-card:hover {
  transform: translateY(-5px);
  border-color: #93c5fd;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.08);
}

.category-card.active {
  background: #111c35;
  border-color: #2563eb;
  color: white;
}

/* 商品搜索与排序 */
.search-box {
  margin-bottom: 18px;
}

.search-box input {
  width: 100%;
  max-width: 400px;
  padding: 14px 18px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.sort-select {
  padding: 13px 16px;
  margin-bottom: 30px;
  border: 1px solid #dbe3ee;
  border-radius: 9px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.sort-select:focus {
  border-color: #2563eb;
}

/* 商品卡片 */
.product-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.product-card {
  background: white;
  border: 1px solid #e5eaf2;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: #bfdbfe;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.09);
}

.product-image {
  background: #f1f5f9;
  padding: 18px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transition: transform 0.35s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 750;
}

.product-info p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  min-height: 42px;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.product-bottom strong {
  font-size: 19px;
  color: #2563eb;
}

.product-bottom button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #111c35;
  color: white;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s;
}

.product-bottom button:hover {
  background: #2563eb;
}

.status-message {
  padding: 50px 0;
  text-align: center;
  color: #64748b;
}

/* 页脚 */
.footer {
  padding: 55px 10%;
  background: #0b1220;
  color: white;
  text-align: center;
}

.footer p {
  margin: 15px 0;
  color: #94a3b8;
}

.footer small {
  color: #64748b;
  font-size: 12px;
}

/* 平板 */
@media (max-width: 1000px) {
  .navbar {
    padding: 12px 4%;
  }

  .navbar nav {
    gap: 16px;
  }

  .category-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section {
    padding: 65px 6%;
  }
}

/* 手机 */
@media (max-width: 650px) {
  .navbar {
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 5%;
  }

  .navbar nav {
    display: none;
  }

  .user-info {
    gap: 7px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .user-info span {
    display: none;
  }

  .user-info button,
  .login-link {
    padding: 9px 11px;
    font-size: 12px;
  }

  .hero {
    min-height: 430px;
    padding: 65px 7%;
  }

  .hero-decoration {
    display: none;
  }

  .hero h1 {
    font-size: 48px;
  }

  .section {
    padding: 55px 5%;
  }

  .section-heading h2 {
    font-size: 25px;
  }

  .category-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .category-card {
    padding: 23px 10px;
  }

  .product-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .product-info {
    padding: 13px;
  }

  .product-info h3 {
    font-size: 14px;
  }

  .product-info p {
    font-size: 12px;
  }

  .product-bottom strong {
    font-size: 16px;
  }

  .search-box input {
    max-width: 100%;
  }
}

</style>

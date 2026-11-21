import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {

  // 购物车商品
  const cartItems = ref<any[]>(
  JSON.parse(localStorage.getItem('cartItems') || '[]')
  );

  // 添加商品到购物车
  const addToCart = (product: any, quantity = 1) => {
    const existingItem = cartItems.value.find(
      item => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        ...product,
        quantity
      });
    }
  };

  // 修改商品数量
  const updateQuantity = (id: number, quantity: number) => {
    const item = cartItems.value.find(item => item.id === id);

    if (item && quantity >= 1) {
      item.quantity = quantity;
    }
  };

  // 删除购物车商品
  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter(
      item => item.id !== id
    );
  };

  // 监听购物车变化，自动保存到浏览器
  watch(
    cartItems,
    (newValue) => {
      localStorage.setItem('cartItems', JSON.stringify(newValue));
    },
    { deep: true }
  );
  // 购物车商品总数量
  const totalCount = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  });

  
  // 购物车商品总价
  const totalPrice = computed(() => {
    return cartItems.value.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  });

  const clearCart = () => {
    cartItems.value = [];
  };
  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice
  };
});
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  username: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  // 从浏览器读取之前保存的用户信息
  const token = ref(localStorage.getItem('token') || '');

  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // 判断用户是否登录
  const isLoggedIn = computed(() => {
    return !!token.value;
  });

  // 保存登录信息
  const setUser = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // 退出登录
  const logout = () => {
    token.value = '';
    user.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    token,
    user,
    isLoggedIn,
    setUser,
    logout
  };
});
import axios from 'axios';

// 创建请求实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 5000
});
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 创建订单
export function createOrder(data: any) {
  return request.post('/api/orders', data);
}
// 获取我的订单
export function getMyOrders() {
  return request.get('/api/orders/my');
}

// 获取订单详情
export function getOrderDetail(id: number) {
  return request.get(`/api/orders/${id}`);
}
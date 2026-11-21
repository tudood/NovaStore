import axios from 'axios';

// 创建 Axios 请求实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 5000
});

// 用户注册
export function register(data: {
  username: string;
  email: string;
  password: string;
}) {
  return request.post('/api/auth/register', data);
}

// 用户登录
export function login(data: {
  email: string;
  password: string;
}) {
  return request.post('/api/auth/login', data);
}

// 获取用户信息
export function getProfile(token: string) {
  return request.get('/api/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
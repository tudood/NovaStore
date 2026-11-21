import axios from 'axios';

// 创建 Axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 5000
});

// 获取商品列表
export function getProducts() {
    return request.get('/api/products');
}

// 根据 ID 获取商品详情
export function getProduct(id: number) {
    return request.get(`/api/products/${id}`);
}
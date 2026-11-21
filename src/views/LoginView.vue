<template>
  <div class="login-page">
  <button class="back-home" @click="router.push('/')">
    ← Back to Home
  </button>

  <div class="login-box">
    <div class="brand">
      <span class="brand-icon">N</span>
      <span>NOVASTORE</span>
    </div>
      <h1>Welcome Back</h1>
      <p>Sign in to your NovaStore account</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p v-if="errorMessage" class="error">
          {{ errorMessage }}
        </p>
      </form>
        <div class="register-tip">
            Don't have an account?
            <router-link to="/register">Create Account</router-link>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../api/auth';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { showToast } from '../composables/useToast';

const userStore = useUserStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await login({
      email: email.value,
      password: password.value
    });

    userStore.setUser(
        response.data.token,
        response.data.user
        );

    showToast('Login successful!', 'success');
    router.push('/');

  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.12), transparent 35%),
    radial-gradient(circle at 85% 80%, rgba(59, 130, 246, 0.1), transparent 35%),
    #f5f7fa;
}

/* 返回首页 */
.back-home {
  position: absolute;
  top: 30px;
  left: 35px;
  padding: 11px 17px;
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-home:hover {
  color: #2563eb;
  border-color: #2563eb;
  transform: translateX(-3px);
}

/* 登录卡片 */
.login-box {
  width: 100%;
  max-width: 420px;
  padding: 42px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

/* 品牌标识 */
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 35px;
  color: #0f172a;
  font-size: 17px;
  font-weight: 850;
  letter-spacing: 2px;
}

.brand-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: #fff;
  background: #2563eb;
  border-radius: 10px;
  font-size: 20px;
  letter-spacing: 0;
}

/* 标题 */
.login-box h1 {
  margin-bottom: 10px;
  color: #111827;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -1px;
}

.login-box > p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 30px;
  line-height: 1.6;
}

/* 表单 */
.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.form-group input {
  display: block;
  width: 100%;
  padding: 14px 15px;
  box-sizing: border-box;
  color: #111827;
  background: #f8fafc;
  border: 1px solid #dbe2ea;
  border-radius: 9px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.form-group input::placeholder {
  color: #94a3b8;
}

.form-group input:focus {
  background: #fff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* 登录按钮 */
.login-box form button {
  width: 100%;
  padding: 15px;
  margin-top: 8px;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18);
}

.login-box form button:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
}

.login-box form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 错误提示 */
.error {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 11px 13px;
  margin-top: 18px;
  font-size: 13px;
}

/* 手机端 */
@media (max-width: 480px) {
  .login-box {
    padding: 30px 24px;
  }

  .login-box h1 {
    font-size: 26px;
  }

  .back-home {
    top: 15px;
    left: 15px;
  }
}
.register-tip {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #edf0f5;
  text-align: center;
  color: #64748b;
  font-size: 13px;
}

.register-tip a {
  margin-left: 5px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.register-tip a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
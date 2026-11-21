
<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="['toast-message', type]"
    >
      <span class="toast-icon">
        {{ type === 'success' ? '✓' : type === 'error' ? '!' : 'i' }}
      </span>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  message: string;
  type?: 'success' | 'error' | 'info';
}>();

const visible = ref(false);

watch(
  () => props.message,
  (value) => {
    visible.value = !!value;
  },
  { immediate: true }
);
</script>

<style scoped>
.toast-message {
  position: fixed;
  top: 25px;
  right: 25px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
  max-width: calc(100vw - 40px);
  padding: 16px 20px;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.success {
  background: #16a34a;
}

.error {
  background: #dc2626;
}

.info {
  background: #2563eb;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

@media (max-width: 480px) {
  .toast-message {
    top: 15px;
    right: 15px;
    left: 15px;
    min-width: 0;
  }
}
</style>

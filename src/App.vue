<script setup lang="ts">
import Toast from './components/Toast.vue';
import { toastState } from './composables/useToast';
</script>

<template>
  <router-view />

  <Toast
    :message="toastState.message"
    :type="toastState.type"
  />
</template>
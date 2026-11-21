
import { reactive } from 'vue';

export const toastState = reactive({
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
});

let timer: ReturnType<typeof setTimeout> | null = null;

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' = 'success'
) => {
  if (timer) {
    clearTimeout(timer);
  }

  toastState.message = '';
  toastState.type = type;

  setTimeout(() => {
    toastState.message = message;
  }, 10);

  timer = setTimeout(() => {
    toastState.message = '';
  }, 3010);
};

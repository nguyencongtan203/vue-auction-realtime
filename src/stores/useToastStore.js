import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toast = ref({
    show: false,
    message: '',
    type: 'success',
  });

  const toastMeta = computed(() => {
    const type = (toast.value.type || 'info').toLowerCase();
    if (type === 'success') {
      return {
        title: 'Thành công!',
        barBg: 'bg-emerald-500',
        titleColor: 'text-emerald-500',
        iconPaths: [
          'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z',
        ],
      };
    }
    if (type === 'warning') {
      return {
        title: 'Cảnh báo!',
        barBg: 'bg-yellow-400',
        titleColor: 'text-yellow-400',
        iconPaths: [
          'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z',
        ],
      };
    }
    if (type === 'error') {
      return {
        title: 'Lỗi!',
        barBg: 'bg-red-500',
        titleColor: 'text-red-500',
        iconPaths: [
          'M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z',
        ],
      };
    }
    // info (mặc định)
    return {
      title: 'Info',
      barBg: 'bg-blue-500',
      titleColor: 'text-blue-500',
      iconPaths: [
        'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z',
        'M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z',
      ],
    };
  });

  const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => (toast.value.show = false), 3000);
  };

  return { toast, toastMeta, showToast };
});
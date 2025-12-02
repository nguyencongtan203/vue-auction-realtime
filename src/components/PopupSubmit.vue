<template>
  <transition name="fade-modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      @click="$emit('close')"
    >
      <div
        class="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto"
        @click.stop
      >
        <!-- Icon cảnh báo -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center" :style="{ backgroundColor: iconBg }">
            <svg class="w-8 h-8" :style="{ color: iconColor }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"></path>
            </svg>
          </div>
        </div>

        <!-- Message -->
        <div class="text-center mb-6">
          <p class="text-lg font-medium text-gray-800 leading-relaxed">{{ message }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 justify-center">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Hủy
          </button>
          <button type="button" class="btn-submit btn-flash" :style="{ background: buttonBg, color: '#ffffff' }" @click="$emit('submit')">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visible: Boolean,
  message: String,
  actionType: {
    type: String,
    default: 'delete',
    validator: (value) => ['create', 'update', 'delete'].includes(value),
  },
});

defineEmits(['close', 'submit']);

// Computed cho icon và màu sắc dựa trên actionType
const iconConfig = computed(() => {
  switch (props.actionType) {
    case 'create':
      return {
        path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        color: '#10b981',
        bg: '#ecfdf5',
        buttonBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      };
    case 'update':
      return {
        path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z', // Icon warning (dấu chấm than)
        color: '#f59e0b',
        bg: '#fffbeb',
        buttonBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      };
    case 'delete':
    default:
      return {
        path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z', // Icon warning (dấu chấm than)
        color: '#dc2626',
        bg: '#fef2f2',
        buttonBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      };
  }
});

const iconPath = computed(() => iconConfig.value.path);
const iconColor = computed(() => iconConfig.value.color);
const iconBg = computed(() => iconConfig.value.bg);
const buttonBg = computed(() => iconConfig.value.buttonBg);
</script>

<style scoped>
/* Animation cho modal */
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

.fade-modal-enter-active > div,
.fade-modal-leave-active > div {
  transition: transform 0.3s ease;
}

.fade-modal-enter-from > div,
.fade-modal-leave-to > div {
  transform: scale(0.9);
}

/* Buttons */
.btn-cancel {
  padding: 10px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.btn-submit {
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-submit:hover {
  filter: brightness(1.1);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 480px) {
  .relative {
    padding: 24px;
  }

  .flex.gap-3 {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
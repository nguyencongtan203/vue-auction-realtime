<template>
  <transition name="fade-modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      @click="hide"
    >
      <div
        class="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto"
        @click.stop
      >
        <!-- Icon cảnh báo -->
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center bg-yellow-100"
          >
            <svg
              class="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Message -->
        <div class="text-center mb-6">
          <p class="text-lg font-medium text-gray-800 leading-relaxed">{{ message }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../stores/notificationStore";

const notification = useNotificationStore();
const { visible, message } = storeToRefs(notification);
const { hide } = notification;
</script>

<style scoped>
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

@media (max-width: 480px) {
  .relative {
    padding: 24px;
  }

  .flex.gap-3 {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel {
    width: 100%;
  }
}
</style>

<template>
  <!-- ChangePasswordPopup.vue -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    @click.self="close"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transition-all animate-fadeIn"
    >
      <button @click="close" class="absolute top-3 right-3 transition point" aria-label="Đóng">
        <font-awesome-icon :icon="faX" />
      </button>

      <h3 class="text-xl font-bold text-slate-800 text-center mb-6">Đổi mật khẩu</h3>

      <form @submit.prevent="handleChangePassword" class="space-y-5">
        <div>
          <label for="oldPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu cũ
          </label>
          <input
            id="oldPassword"
            v-model.trim="matkhaucu"
            type="password"
            required
            placeholder="Nhập mật khẩu cũ"
            autocomplete="current-password"
            class="input"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            v-model.trim="matkhaumoi"
            type="password"
            required
            placeholder="Nhập mật khẩu mới"
            autocomplete="new-password"
            class="input"
            :disabled="loading"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            v-model.trim="xacnhan"
            type="password"
            required
            placeholder="Nhập lại mật khẩu mới"
            autocomplete="new-password"
            class="input"
            :disabled="loading"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary btn-flash">
          <span v-if="loading">Đang xử lý...</span>
          <span v-else>Đổi mật khẩu</span>
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, inject } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserStore } from "../stores/userStore";
import { useToastStore } from "../stores/useToastStore";
import { useRouter } from "vue-router";
import { faX } from "@fortawesome/free-solid-svg-icons";
const router = useRouter();
const API = "http://localhost:8082/api";

const show = ref(false);
const matkhaucu = ref("");
const matkhaumoi = ref("");
const xacnhan = ref("");
const loading = ref(false);
const error = ref("");

const authPopup = inject("authPopup");
const userStore = useUserStore();
const toastStore = useToastStore();

// Helpers
function open() {
  show.value = true;
  matkhaucu.value = "";
  matkhaumoi.value = "";
  xacnhan.value = "";
  error.value = "";
}
function close() {
  show.value = false;
}

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  if (err?.message) return err.message;
  return "Lỗi không xác định";
}

async function handleChangePassword() {
  error.value = "";
  if (matkhaumoi.value !== xacnhan.value) {
    error.value = "Mật khẩu mới và xác nhận không khớp!";
    return;
  }
  const token = Cookies.get("jwt_token");
  if (!token) {
    error.value = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    authPopup?.value?.open("login");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      matkhaucu: matkhaucu.value.trim(),
      matkhaumoi: matkhaumoi.value.trim(),
    };

    const res = await axios.put(`${API}/users/change-password`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { code, message } = res.data || {};
    if (code === 200) {
      toastStore.showToast(message || "Đổi mật khẩu thành công.", "success");
      Cookies.remove("jwt_token");
      userStore.logout();

      close();
      router.push("/home");
      authPopup?.value?.open("login");
    } else {
      const msg = message || "Đổi mật khẩu thất bại!";
      error.value = msg;
      toastStore.showToast(msg, "error");
    }
  } catch (err) {
    const msg = extractErrorMessage(err);
    error.value = msg;
    toastStore.showToast(msg, "error");

    const status = err?.response?.status;
    if (status === 401) {
      Cookies.remove("jwt_token");
      userStore.logout();
      authPopup?.value?.open("login");
    }
  } finally {
    loading.value = false;
  }
}

defineExpose({ open, close });
</script>

<style scoped>
@import "@/assets/styles/auth.css";

/* Áp dụng CSS từ bạn cung cấp để match AuthPopup */
.input {
  @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition text-gray-800 placeholder-gray-400;
  background-color: #f9fafb;
}
.input:disabled {
  @apply opacity-70 cursor-not-allowed;
}

.btn-primary {
  @apply w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition;
  background-color: #127fcf;
}
.btn-primary:hover {
  filter: brightness(1.05);
  background-color: #1992eb;
}

.btn-flash {
  @apply hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2;
}

.error-msg {
  @apply text-sm text-red-500 text-center font-medium;
}

.animate-fadeIn {
  animation: fadeIn 0.35s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

button,
a {
  transition: all 0.25s ease;
}

a:hover {
  text-decoration: underline;
}
</style>

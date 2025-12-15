<template>
  <!-- ChangePasswordPopup.vue -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    @click.self="close"
  >
    <div
      class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transition-all"
    >
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        aria-label="Đóng"
      >
        ✖
      </button>

      <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">Đổi mật khẩu</h3>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
            <input
              type="password"
              v-model.trim="matkhaucu"
              class="input"
              required
              autocomplete="current-password"
              :disabled="loading"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              v-model.trim="matkhaumoi"
              class="input"
              required
              autocomplete="new-password"
              :disabled="loading"
            />
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              v-model.trim="xacnhan"
              class="input"
              required
              autocomplete="new-password"
              :disabled="loading"
            />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
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

/* ===== Helpers ===== */
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

    const res = await axios.put(
      `${API}/users/change-password`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

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

.error-msg {
  @apply text-sm text-red-600 mt-2;
}
.input {
  @apply w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition;
}
.btn-primary {
  @apply inline-flex justify-center items-center rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition;
}
</style>
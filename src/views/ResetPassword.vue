<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useToastStore } from "../stores/useToastStore";

const route = useRoute();
const router = useRouter();
const toastStore = useToastStore();

const token = ref("");
const password = ref("");
const confirmPassword = ref("");

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

onMounted(() => {
  token.value = String(route.query.token || "").trim();
  if (!token.value) {
    toastStore.showToast(
      "Link không hợp lệ hoặc thiếu token. Vui lòng kiểm tra lại email.",
      "error"
    );
  }
});

const passwordStrengthHint = computed(() => {
  const p = password.value;
  if (!p) return "";
  if (p.length < 8) return "Mật khẩu nên tối thiểu 8 ký tự.";
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNum = /\d/.test(p);
  const hasSpecial = /[^A-Za-z0-9]/.test(p);
  const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;

  if (score <= 1) return "Yếu.";
  if (score === 2) return "Trung bình.";
  return "Mạnh.";
});

const canSubmit = computed(() => {
  if (!token.value) return false;
  if (!password.value || !confirmPassword.value) return false;
  if (password.value.length < 8) return false;
  if (password.value !== confirmPassword.value) return false;
  return true;
});

const submit = async () => {
  errorMsg.value = "";
  successMsg.value = "";

  if (!token.value) {
    errorMsg.value = "Thiếu token. Link reset có vấn đề.";
    return;
  }
  if (!password.value) {
    errorMsg.value = "Nhập mật khẩu mới.";
    return;
  }
  if (password.value.length < 8) {
    errorMsg.value = "Mật khẩu phải tối thiểu 8 ký tự.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Mật khẩu nhập lại không khớp.";
    return;
  }

  loading.value = true;
  try {
    const res = await axios.put(
      "http://localhost:8082/api/auth/reset-password",
      { matkhau: password.value },
      {
        params: { token: token.value },
        validateStatus: () => true,
      }
    );

    if (res.status >= 200 && res.status < 300 && res.data?.code === 200) {
      successMsg.value = res.data?.message || "Đổi mật khẩu thành công.";
      password.value = "";
      confirmPassword.value = "";
      setTimeout(() => router.push("/login"), 1200);
      return;
    }

    errorMsg.value = res?.data?.message || "Có lỗi xảy ra. Thử lại sau.";
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || "Có lỗi xảy ra. Thử lại sau.";
  } finally {
    loading.value = false;
  }
};

const goHome = () => router.push("/");
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div class="text-center mb-6">
        <h1 class="text-[22px] md:text-[26px] font-semibold text-gray-900">
          Đặt lại mật khẩu
        </h1>
        <p class="text-gray-600 mt-2">
          Nhập mật khẩu mới để hoàn tất việc reset. Token mà sai là khỏi cứu.
        </p>
      </div>

      <div
        v-if="errorMsg"
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4"
      >
        {{ errorMsg }}
      </div>

      <div
        v-if="successMsg"
        class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 mb-4"
      >
        {{ successMsg }}
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="Tối thiểu 8 ký tự"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            :disabled="loading || !token"
          />
          <p v-if="passwordStrengthHint" class="text-xs text-gray-500 mt-1">
            {{ passwordStrengthHint }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nhập lại mật khẩu</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Nhập lại cho chắc"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            :disabled="loading || !token"
          />
          <p
            v-if="confirmPassword && password !== confirmPassword"
            class="text-xs text-red-600 mt-1"
          >
            Không khớp.
          </p>
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-sky-600 text-white py-3 font-medium hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading || !canSubmit"
        >
          <span v-if="loading">Đang cập nhật...</span>
          <span v-else>Đổi mật khẩu</span>
        </button>

        <div class="flex items-center justify-between text-sm pt-2">
          <button
            type="button"
            class="text-gray-600 hover:text-gray-900"
            @click="goHome"
            :disabled="loading"
          >
            Về trang chủ
          </button>
          <router-link to="/login" class="text-sky-700 hover:text-sky-900 font-medium">
            Về đăng nhập
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
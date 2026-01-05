<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div class="text-center mb-6">
        <h1 class="text-[22px] md:text-[26px] font-semibold text-gray-900">
          Quên mật khẩu
        </h1>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="Nhập email của bạn"
            class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            :disabled="loading"
          />
          <p v-if="email && !isEmailValid" class="text-xs text-red-600 mt-1">
            Email không hợp lệ.
          </p>
        </div>

        <div
          v-if="errorMsg"
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ errorMsg }}
        </div>

        <div
          v-if="successMsg"
          class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {{ successMsg }}
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-sky-600 text-white py-3 font-medium hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="loading">Đang gửi...</span>
          <span v-else>Gửi link xác thực</span>
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

          <button
            type="button"
            class="text-sky-700 hover:text-sky-900 font-medium"
            @click="goLogin"
            :disabled="loading"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const isEmailValid = computed(() => {
  // Regex basic, đủ dùng cho UI validate
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
});

const submit = async () => {
  errorMsg.value = "";
  successMsg.value = "";

  const value = email.value.trim();
  if (!value) {
    errorMsg.value = "Email không được để trống.";
    return;
  }
  if (!isEmailValid.value) {
    errorMsg.value = "Email không hợp lệ.";
    return;
  }

  loading.value = true;
  try {
    const res = await axios.post(
      "http://localhost:8082/api/auth/forgot-password",
      { email: value },
      { validateStatus: () => true }
    );

    if (res.data?.code === 200) {
      successMsg.value = res.data.message || "Đã gửi link đặt lại mật khẩu qua email!";
      return;
    }

    if (res.data?.code === 404) {
      errorMsg.value = res.data.message || "Không tìm thấy email.";
      return;
    }

    errorMsg.value = res.data?.message || "Có lỗi xảy ra. Thử lại sau.";
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || "Có lỗi xảy ra. Thử lại sau.";
  } finally {
    loading.value = false;
  }
};

const goHome = () => router.push("/");
const goLogin = () => { window.location.href = '/login'; };
</script>
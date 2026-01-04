<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-xl font-bold mb-4">Đăng ký OTP SĐT</h2>

    <!-- STEP 1 -->
    <form v-if="step === 1" @submit.prevent="sendOtp" class="space-y-3">
      <input v-model="form.ho" placeholder="Họ" class="input" required />
      <input v-model="form.tenlot" placeholder="Tên lót" class="input" />
      <input v-model="form.ten" placeholder="Tên" class="input" required />
      <input v-model="form.email" placeholder="Email" class="input" required />
      <input v-model="form.sdt" placeholder="0xxx" class="input" required />
      <input v-model="form.matkhau" type="password" placeholder="Mật khẩu" class="input" required />
      <input v-model="confirm" type="password" placeholder="Xác nhận mật khẩu" class="input" required />

      <button class="btn-primary w-full">Gửi OTP</button>
      <p class="text-red-500" v-if="error">{{ error }}</p>
    </form>

    <!-- STEP 2 -->
    <form v-else @submit.prevent="verifyOtp" class="space-y-3">
      <input v-model="otp" placeholder="Nhập OTP" class="input" required />
      <button class="btn-primary w-full">Xác nhận</button>
      <p class="text-red-500" v-if="error">{{ error }}</p>
    </form>

    <div id="recaptcha-container"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { auth } from "@/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const API = "http://localhost:8082/api";

const step = ref(1);
const otp = ref("");
const confirm = ref("");
const error = ref("");
let confirmationResult = null;

const form = ref({
  ho: "",
  tenlot: "",
  ten: "",
  email: "",
  sdt: "",
  matkhau: "",
});

const sendOtp = async () => {
  error.value = "";

  if (form.value.matkhau !== confirm.value) {
    error.value = "Mật khẩu không khớp";
    return;
  }

  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      await window.recaptchaVerifier.render();
    }

    const phone = "+84" + form.value.sdt.substring(1);

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    step.value = 2;
  } catch (e) {
    console.error(e);
    error.value = e.message || "Không gửi được OTP";
  }
};

const verifyOtp = async () => {
  error.value = "";

  try {
    const result = await confirmationResult.confirm(otp.value);
    const idToken = await result.user.getIdToken();

    await axios.post(
      `${API}/users/create`,
      { ...form.value },
      {
        headers: {
          Authorization: "Bearer " + idToken,
        },
      }
    );

    alert("Đăng ký thành công");
    step.value = 1;
  } catch (e) {
    console.error(e);
    error.value = "OTP không hợp lệ";
  }
};
</script>

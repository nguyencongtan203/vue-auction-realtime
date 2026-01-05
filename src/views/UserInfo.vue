<template>
  <!-- UserInfo.vue -->
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <h2
      class="text-[22px] md:text-[26px] font-semibold text-slate-900 tracking-tight pb-10 text-center"
    >
      THÔNG TIN TÀI KHOẢN
    </h2>

    <!-- Toast -->
    <transition name="slide-fade">
      <div v-if="toast.show" class="fixed top-5 right-5 z-50">
        <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow">
          <div class="flex items-center justify-center w-12" :class="toastMeta.barBg">
            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40">
              <template v-for="(d, i) in toastMeta.iconPaths" :key="i">
                <path :d="d" />
              </template>
            </svg>
          </div>
          <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
              <span class="font-semibold" :class="toastMeta.titleColor">{{
                toastMeta.title
              }}</span>
              <p class="text-sm text-gray-600">{{ toast.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Layout: Sidebar phải + Content giữa -->
    <div class="max-w-[1200px] mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-start gap-8">
        <!-- RIGHT: content -->
        <div class="flex-1">
          <div v-if="loading" class="text-center text-gray-500 py-6 fade-in">
            Đang tải thông tin người dùng...
          </div>

          <div v-else-if="!user" class="text-center text-red-600 py-6 fade-in">
            Không thể tải thông tin tài khoản.
          </div>

          <!-- Content -->
          <div v-else class="w-full max-w-3xl ml-auto space-y-5">
            <!-- Thông tin tổng quát -->
            <div class="space-y-3 fade-in">
              <div class="flex items-center gap-4">
                <label class="w-40 text-sm text-gray-700 font-bold">Họ và tên</label>
                <p class="text-gray-900 flex-1">{{ fullName }}</p>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-40 text-sm font-bold text-gray-700">Email</label>
                <div class="flex items-center gap-2 flex-1">
                  <p class="text-gray-900">{{ user.email }}</p>
                  <span
                    v-if="!emailVerified"
                    class="text-red-600 text-sm font-medium italic"
                    >(Email chưa được xác thực)</span
                  >
                  <span v-else class="text-emerald-600 text-sm font-medium italic"
                    >(Đã xác thực)</span
                  >
                  <!-- Nút gửi xác thực lại -->
                  <button
                    v-if="!emailVerified"
                    @click="resendVerifyCode"
                    :disabled="resending"
                    class="ml-2 px-2 py-1 text-white text-xs rounded disabled:bg-gray-400 bg-[#127fcf] hover:bg-[#1992eb] font-semibold btn-flash"
                  >
                    {{ resending ? "Đang gửi..." : "Gửi lại" }}
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <label class="w-40 text-sm font-bold text-gray-700">Mật khẩu</label>
                <div class="flex items-center gap-3 flex-1">
                  <p class="text-gray-900 tracking-widest select-none">•••••</p>
                  <a
                    href="#"
                    class="text-sky-600 hover:text-sky-700 text-sm font-medium underline"
                    @click.prevent="openChangePassword"
                    >Đổi mật khẩu</a
                  >
                </div>
              </div>
            </div>

            <hr class="border-gray-300 my-4 fade-in" />

            <!-- FORM -->
            <div class="space-y-4 fade-in">
              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Họ</label>
                <div class="flex-1">
                  <input
                    v-model="user.ho"
                    :disabled="!editing"
                    :class="['input', errors.ho && 'error']"
                  />
                  <p v-if="errors.ho" class="error-msg">{{ errors.ho }}</p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Tên đệm</label>
                <div class="flex-1">
                  <input
                    v-model="user.tenlot"
                    :disabled="!editing"
                    :class="['input', errors.tenlot && 'error']"
                  />
                  <p v-if="errors.tenlot" class="error-msg">{{ errors.tenlot }}</p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Tên</label>
                <div class="flex-1">
                  <input
                    v-model="user.ten"
                    :disabled="!editing"
                    :class="['input', errors.ten && 'error']"
                  />
                  <p v-if="errors.ten" class="error-msg">{{ errors.ten }}</p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Số điện thoại</label>
                <div class="flex-1">
                  <input
                    v-model="user.sdt"
                    :disabled="!editing"
                    :class="['input', errors.sdt && 'error']"
                  />
                  <p v-if="errors.sdt" class="error-msg">{{ errors.sdt }}</p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Địa chỉ</label>
                <div class="flex-1">
                  <input
                    v-model="user.diachi"
                    placeholder="Chưa cập nhật"
                    :disabled="!editing"
                    :class="['input', errors.diachi && 'error']"
                  />
                  <p v-if="errors.diachi" class="error-msg">{{ errors.diachi }}</p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold"
                  >Địa chỉ giao hàng</label
                >
                <div class="flex-1">
                  <input
                    v-model="user.diachigiaohang"
                    placeholder="Chưa cập nhật"
                    :disabled="!editing"
                    :class="['input', errors.diachigiaohang && 'error']"
                  />
                  <p v-if="errors.diachigiaohang" class="error-msg">
                    {{ errors.diachigiaohang }}
                  </p>
                </div>
              </div>

              <div class="form-row">
                <label class="w-40 text-sm text-gray-700 font-bold">Thành phố</label>
                <div class="flex-1">
                  <SoftDropdown
                    v-model="user.thanhPho.matp"
                    :options="cityOptions"
                    option-value="value"
                    option-label="label"
                    :disabled="!editing"
                    :error="!!errors.matp"
                    :errorMessage="errors.matp"
                    placeholder="-- Chưa chọn thành phố --"
                  />
                  <p v-if="errors.matp" class="error-msg">{{ errors.matp }}</p>
                </div>
              </div>

              <div class="form-row">
                <div class="w-40">
                  <p class="text-sm text-gray-700 font-bold leading-tight">
                    Căn cước công dân
                  </p>

                  <p class="text-sm mt-1 px-4 font-medium" :class="kycTextClass">
                    ({{ kycLabel }})
                  </p>
                </div>

                <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Mặt trước -->
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-700">Mặt trước</p>

                    <div
                      class="relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-sky-400 transition"
                      :class="errors.cccdFront && 'border-red-500'"
                      ,
                      @click="editing && !kycVerified && $refs.cccdFrontInput.click()"
                    >
                      <input
                        ref="cccdFrontInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        :disabled="!editing || kycVerified"
                        @change="onCccdFrontChange"
                      />

                      <img
                        v-if="cccdFrontPreview || user?.anhmattruoc"
                        :src="cccdFrontPreview || getImageUrl(user.anhmattruoc)"
                        class="mx-auto max-h-40 object-contain rounded"
                      />

                      <p v-else class="text-gray-400 text-sm">
                        {{ editing ? "Chọn ảnh CCCD mặt trước" : "Chưa có ảnh" }}
                      </p>
                    </div>

                    <p v-if="errors.cccdFront" class="error-msg">
                      {{ errors.cccdFront }}
                    </p>
                  </div>

                  <!-- Mặt sau -->
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-700">Mặt sau</p>

                    <div
                      class="relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-sky-400 transition"
                      :class="errors.cccdBack && 'border-red-500'"
                      @click="editing && !kycVerified && $refs.cccdBackInput.click()"
                    >
                      <input
                        ref="cccdBackInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        :disabled="!editing || kycVerified"
                        @change="onCccdBackChange"
                      />

                      <img
                        v-if="cccdBackPreview || user?.anhmatsau"
                        :src="cccdBackPreview || getImageUrl(user.anhmatsau)"
                        class="mx-auto max-h-40 object-contain rounded"
                      />

                      <p v-else class="text-gray-400 text-sm">
                        {{ editing ? "Chọn ảnh CCCD mặt sau" : "Chưa có ảnh" }}
                      </p>
                    </div>

                    <p v-if="errors.cccdBack" class="error-msg">
                      {{ errors.cccdBack }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- BTN -->
            <div class="pt-6 flex justify-end gap-3">
              <!-- Nút KYC: chỉ hiện khi chưa xác thực và đang không edit -->
              <button
                v-if="!editing && !kycVerified"
                @click="goToKycVerify"
                class="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold btn-flash"
              >
                Xác thực KYC
              </button>

              <button
                v-if="!editing"
                @click="enableEdit"
                class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
              >
                Chỉnh Sửa
              </button>
              <button
                v-else
                @click="saveChanges"
                class="inline-flex items-center bg-[#127fcf] hover:bg-[#1992eb] text-white px-4 py-2 rounded-xl font-semibold btn-flash"
                :disabled="saving"
              >
                <span v-if="saving">Đang lưu...</span>
                <span v-else>Lưu Thay Đổi</span>
              </button>
              <button
                v-if="editing"
                @click="cancelEdit"
                class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
        <!-- Right: AccountSite -->
        <div class="lg:w-[280px] lg:shrink-0 fade-in">
          <AccountSite :name="fullName || 'Tài khoản'" :verified="emailVerified" />
        </div>
      </div>
    </div>
  </div>

  <ChangePasswordPopup ref="changePasswordPopup" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import ChangePasswordPopup from "@/components/ChangePasswordPopup.vue";
import SoftDropdown from "@/components/SoftDropdown.vue";
import AccountSite from "@/components/AccountSite.vue";

const API = "http://localhost:8082/api";
const getImageUrl = (tenanh) => `${API}/imgs/kyc/${tenanh}`;
const userStore = useUserStore();
const router = useRouter();

const kycLabel = computed(() => user.value?.xacthuckyc || "Chưa xác thực");

const kycVerified = computed(() => {
  const s = String(user.value?.xacthuckyc || "").toUpperCase();
  return s === "ACTIVE" || s === "ĐÃ XÁC THỰC" || s === "ĐANG HOẠT ĐỘNG";
});

const kycTextClass = computed(() => {
  return kycVerified.value ? "text-emerald-600" : "text-red-600";
});

function goToKycVerify() {
  const front = user.value?.anhmattruoc || "";
  router.push({
    name: "kycCCCD", // tên route của mày
    query: { front },
  });
}

// Reactive state
const changePasswordPopup = ref(null);
const cities = ref([]);
const saving = ref(false);
const editing = ref(false);
const originalData = ref(null);
const errors = ref({});
const toast = ref({ show: false, message: "", type: "success" });
const resending = ref(false);

/* =======================
   CCCD (NEW)
======================= */
const cccdFrontFile = ref(null);
const cccdBackFile = ref(null);
const cccdFrontPreview = ref("");
const cccdBackPreview = ref("");

function revokePreview(url) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch (_) {}
}

function resetCccdState() {
  cccdFrontFile.value = null;
  cccdBackFile.value = null;
  revokePreview(cccdFrontPreview.value);
  revokePreview(cccdBackPreview.value);
  cccdFrontPreview.value = "";
  cccdBackPreview.value = "";
  delete errors.value.cccdFront;
  delete errors.value.cccdBack;
}

function onCccdFrontChange(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;

  if (!file.type?.startsWith("image/")) {
    errors.value.cccdFront = "File phải là hình ảnh.";
    return;
  }

  delete errors.value.cccdFront;
  cccdFrontFile.value = file;
  revokePreview(cccdFrontPreview.value);
  cccdFrontPreview.value = URL.createObjectURL(file);
}

function onCccdBackChange(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;

  if (!file.type?.startsWith("image/")) {
    errors.value.cccdBack = "File phải là hình ảnh.";
    return;
  }

  delete errors.value.cccdBack;
  cccdBackFile.value = file;
  revokePreview(cccdBackPreview.value);
  cccdBackPreview.value = URL.createObjectURL(file);
}
/* =======================
   END CCCD
======================= */

// Computed từ store
const user = computed(() => userStore.user);
const loading = computed(() => userStore.loading);

const toastMeta = computed(() => {
  const type = (toast.value.type || "info").toLowerCase();
  switch (type) {
    case "success":
      return {
        title: "Thành công!",
        barBg: "bg-emerald-500",
        titleColor: "text-emerald-500",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
        ],
      };
    case "warning":
      return {
        title: "Cảnh báo!",
        barBg: "bg-yellow-400",
        titleColor: "text-yellow-400",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
        ],
      };
    case "error":
      return {
        title: "Lỗi!",
        barBg: "bg-red-500",
        titleColor: "text-red-500",
        iconPaths: [
          "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
        ],
      };
    default:
      return {
        title: "Thông báo",
        barBg: "bg-blue-500",
        titleColor: "text-blue-500",
        iconPaths: [
          "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
          "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
        ],
      };
  }
});

const fullName = computed(() =>
  [user.value?.ho, user.value?.tenlot, user.value?.ten].filter(Boolean).join(" ")
);

const emailVerified = computed(() => {
  const status = (user.value?.xacthuctaikhoan || "").toUpperCase();
  return status === "ACTIVE" || status === "ĐÃ XÁC THỰC";
});

const cityOptions = computed(() =>
  (cities.value || []).map((tp) => ({ value: String(tp.matp), label: tp.tentp }))
);

function showToast(message, type = "success") {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function enableEdit() {
  if (!user.value) return;
  editing.value = true;
  originalData.value = JSON.parse(JSON.stringify(user.value));
  errors.value = {};
  // CCCD (NEW)
  resetCccdState();
}

function cancelEdit() {
  if (originalData.value) {
    user.value = JSON.parse(JSON.stringify(originalData.value));
  }
  editing.value = false;
  errors.value = {};
  // CCCD (NEW)
  resetCccdState();
}

function validateUserData() {
  errors.value = {};
  const phoneRegexStart = /^(09|08|07|05|03)/;

  if (!user.value.ho?.trim()) errors.value.ho = "Vui lòng nhập họ.";
  if (!user.value.tenlot?.trim()) errors.value.tenlot = "Vui lòng nhập tên lót.";
  if (!user.value.ten?.trim()) errors.value.ten = "Vui lòng nhập tên.";
  if (!user.value.sdt?.trim()) {
    errors.value.sdt = "Vui lòng nhập số điện thoại.";
  } else if (!/^[0-9]{10,11}$/.test(user.value.sdt)) {
    errors.value.sdt = "Số điện thoại phải gồm 10–11 chữ số.";
  } else if (!phoneRegexStart.test(user.value.sdt)) {
    errors.value.sdt = "Số điện thoại phải bắt đầu bằng 09, 08, 07, 05 hoặc 03.";
  }
  if (!user.value.diachi?.trim()) errors.value.diachi = "Vui lòng nhập địa chỉ.";
  if (!user.value.diachigiaohang?.trim())
    errors.value.diachigiaohang = "Vui lòng nhập địa chỉ giao hàng.";
  if (!user.value.thanhPho?.matp || user.value.thanhPho.matp === "default")
    errors.value.matp = "Vui lòng chọn thành phố.";

  // CCCD: chỉ bắt upload nếu tài khoản chưa có ảnh sẵn
  if (!cccdFrontFile.value && !user.value?.anhmattruoc) {
    errors.value.cccdFront = "Vui lòng tải ảnh CCCD mặt trước.";
  }
  if (!cccdBackFile.value && !user.value?.anhmatsau) {
    errors.value.cccdBack = "Vui lòng tải ảnh CCCD mặt sau.";
  }

  return Object.keys(errors.value).length === 0;
}

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (typeof err?.response?.data === "string") return err.response.data;
  return err?.message || "Lỗi kết nối đến máy chủ!";
}

async function saveChanges() {
  if (!validateUserData()) return;

  const token = userStore.token;
  if (!token) {
    showToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
    return;
  }

  saving.value = true;
  try {
    const cleanString = (str) => str.trim().replace(/\s+/g, " ");

    const payload = {
      ho: cleanString(user.value.ho),
      tenlot: cleanString(user.value.tenlot),
      ten: cleanString(user.value.ten),
      diachi: cleanString(user.value.diachi),
      diachigiaohang: cleanString(user.value.diachigiaohang),
      sdt: user.value.sdt.trim(),
      matp: user.value.thanhPho.matp,
    };

    // CCCD (NEW): gửi multipart/form-data theo backend
    const fd = new FormData();
    fd.append(
      "request",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (cccdFrontFile.value) fd.append("files", cccdFrontFile.value);
    if (cccdBackFile.value) fd.append("files", cccdBackFile.value);

    const res = await axios.put(`${API}/users/update-info`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        // axios sẽ tự set boundary, đừng tự tay set bậy
      },
    });

    const { code, result, message } = res.data || {};
    if (code === 200 && result) {
      await userStore.fetchUser();
      showToast(message || "Cập nhật thông tin thành công!", "success");
      editing.value = false;
      errors.value = {};
      // CCCD (NEW)
      resetCccdState();
    } else {
      showToast(message || "Lưu thất bại, vui lòng thử lại!", "error");
    }
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
  } finally {
    saving.value = false;
  }
}

async function fetchCities() {
  try {
    const citiesRes = await axios.get(`${API}/cities/find-all`);
    if (citiesRes.data?.code === 200 && Array.isArray(citiesRes.data.result)) {
      cities.value = citiesRes.data.result;
    } else {
      cities.value = [];
      showToast("Không thể tải danh sách thành phố!", "error");
    }
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
  }
}

function openChangePassword() {
  changePasswordPopup.value?.open();
}

async function resendVerifyCode() {
  const token = userStore.token;
  if (!token) {
    showToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", "error");
    return;
  }

  resending.value = true;
  try {
    const res = await axios.post(
      `${API}/users/resend-verify-code`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { code, message } = res.data || {};
    if (code === 200) {
      showToast(
        message || "Đã gửi email xác thực đến tài khoản email của bạn",
        "success"
      );
    } else {
      showToast(message || "Không thể gửi email xác thực!", "error");
    }
  } catch (err) {
    showToast(extractErrorMessage(err), "error");
  } finally {
    resending.value = false;
  }
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.loadUserFromCookies();
  }
  await fetchCities();
});
</script>

<style scoped>
@import "@/assets/styles/userinfo.css";
@import "@/assets/styles/toast.css";
</style>

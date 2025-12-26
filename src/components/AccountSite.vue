<template>
  <!-- AccountSite.vue -->
  <aside class="account-card">
    <!-- Header -->
    <div class="account-head">
      <div class="account-type">Tài Khoản</div>
      <div class="account-name">{{ name }}</div>
      <font-awesome-icon
        :icon="faCircleUser"
        class="text-xl avatar"
        style="color: #0f6bae"
      />

      <div class="verify-pill" :class="{ 'verify-pill--ok': verified }">
        {{ verified ? "Đã xác thực" : "Chưa xác thực" }}
      </div>
    </div>

    <!-- Menu -->
    <nav class="menu" aria-label="Account menu">
      <button
        v-for="it in menuItems"
        :key="it.key"
        type="button"
        class="menu-item"
        :class="{ 'menu-item--active': it.key === activeKey }"
        @click="onSelect(it.key)"
      >
        <span class="menu-ico" v-html="icons[it.icon]"></span>
        <span class="menu-label">{{ it.label }}</span>
      </button>

      <div class="divider"></div>

      <button type="button" class="menu-item menu-item--danger" @click="logout">
        <span class="menu-ico" v-html="icons.logout"></span>
        <span class="menu-label">Đăng xuất</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { useToastStore } from "@/stores/useToastStore";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const API = "http://localhost:8082/api";

const props = defineProps({
  name: { type: String, default: "nguyen cong tan" },
  verified: { type: Boolean, default: true },
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const toastStore = useToastStore();

const routeToKey = {
  UserInfo: "profile",
  RegisterProduct: "registerProduct",
  ProductManagement: "productManagement",
  RegisteredAuctions: "registeredAuctions",
  PaymentMana: "paymentManagement",
};

const activeKey = computed(() => routeToKey[route.name] || "");

/* Menu giống Header */
const menuItems = [
  { key: "profile", label: "Thông tin cá nhân", icon: "user" },
  { key: "registerProduct", label: "Đăng ký tài sản", icon: "plus" },
  { key: "productManagement", label: "Quản lý tài sản", icon: "list" },
  { key: "registeredAuctions", label: "Phiên đấu đã đăng ký", icon: "gavel" },
  { key: "paymentManagement", label: "Thanh toán", icon: "wallet" },
];

function onSelect(key) {
  switch (key) {
    case "profile":
      return goUserInfo();
    case "registerProduct":
      return goRegisterProduct();
    case "productManagement":
      return goProductManagement();
    case "registeredAuctions":
      return goRegisteredAuctions();
    case "paymentManagement":
      return goPaymentManagement();
  }
}

// ====== Navigation giống Header.vue ======
function goUserInfo() {
  router.push({ name: "UserInfo" });
}
function goRegisterProduct() {
  router.push({ name: "RegisterProduct" });
}
function goProductManagement() {
  router.push({ name: "ProductManagement" });
}
function goRegisteredAuctions() {
  router.push({ name: "RegisteredAuctions" });
}
function goPaymentManagement() {
  router.push({ name: "PaymentMana" });
}

async function logout() {
  const token = userStore.token;
  try {
    if (token) {
      await axios
        .post(`${API}/auth/logout`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(() => {
          toastStore.showToast(
            "Máy chủ phản hồi không ổn định, vẫn tiến hành đăng xuất.",
            "warning"
          );
        });
    }
  } catch {
    toastStore.showToast("Có lỗi mạng, vẫn tiếp tục đăng xuất.", "warning");
  } finally {
    userStore.logout();
    toastStore.showToast("Đăng xuất thành công!", "success");
    router.push({ name: "Home" });
  }
}

// SVG icons
const icons = {
  user: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.425 0-8.25 2.22-8.25 5.25V21h16.5v-1.5c0-3.03-3.825-5.25-8.25-5.25Z"/>
  </svg>`,
  plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2Z"/>
  </svg>`,
  list: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M4 6h2v2H4V6Zm4 0h12v2H8V6ZM4 11h2v2H4v-2Zm4 0h12v2H8v-2ZM4 16h2v2H4v-2Zm4 0h12v2H8v-2Z"/>
  </svg>`,
  gavel: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M14.1 5.1 12 3l-2.1 2.1 2.1 2.1 2.1-2.1Zm-3.17 3.17 6.8 6.8-2.12 2.12-6.8-6.8 2.12-2.12ZM3 21h6v-2H5v-4H3v6Zm3.76-9.24 2.12-2.12 6.8 6.8-2.12 2.12-6.8-6.8Z"/>
  </svg>`,
  wallet: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M21 7H5a3 3 0 0 1 0-6h14v2H5a1 1 0 0 0 0 2h16v14a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a4 4 0 0 0 3 1h16v2Zm-2 6h-4v2h4v-2Z"/>
  </svg>`,
  logout: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M10 17v-2h4v-2h-4v-2l-3 3 3 3ZM4 4h9a2 2 0 0 1 2 2v3h-2V6H4v12h9v-3h2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>
  </svg>`,
};
</script>

<style scoped>
.account-card {
  width: 280px;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  color: #1e293b;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.account-head {
  padding: 20px 16px 14px;
  text-align: center;
}

.account-type {
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
  color: #475569;
}

.account-name {
  margin-top: 8px;
  font-weight: 700;
  font-size: 18px;
  color: #1e293b;
}

.avatar {
  width: 100px;
  height: 100px;
  margin: 16px auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.verify-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 20px;
  background: #ffe9e9;
  border: 1px solid #fecaca;
  font-weight: 600;
  font-size: 12px;
  color: #c03636;
}

.verify-pill--ok {
  background: #e7f9ef;
  color: #16823d;
  border-color: #bbf7d0;
}

.menu {
  padding: 8px 0 16px;
}

.menu-item {
  width: 100%;
  background: transparent;
  border: 0;
  color: #475569;
  text-align: left;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin: 2px 8px;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item--active {
  background: #e2e8f0;
  color: #1e293b;
}

.menu-ico {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f6bae;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 16px;
}

.menu-item--danger {
  color: #dc2626;
}

.menu-item--danger:hover {
  background: #fef2f2;
}
</style>
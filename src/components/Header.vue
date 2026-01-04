<template>
  <!-- Header.vue -->
  <header
    style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px"
    class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100"
  >
    <div
      class="max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between h-16"
    >
      <!-- Logo -->
      <div
        @click="goHome"
        class="flex items-center gap-3 cursor-pointer btn-flash bg-transparent border-0 shadow-none"
      >
        <img src="/logo.png" alt="Logo" class="h-6 w-auto object-contain" />
      </div>

      <!-- NAV desktop -->
      <nav class="hidden lg:flex items-center gap-8 text-sm">
        <!-- Danh mục tài sản -->
        <div class="relative group">
          <a
            href="javascript:void(0)"
            class="cursor-pointer relative inline-flex items-center gap-1 text-base text-slate-800 group w-max"
            @click.prevent
          >
            <span>Danh mục tài sản</span>
            <span
              class="absolute -bottom-0.5 left-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
            ></span>
            <span
              class="absolute -bottom-0.5 right-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
            ></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:rotate-180 relative top-[2px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </a>

          <!-- Dropdown -->
          <div
            class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute left-0 top-full w-52 bg-white border border-slate-200 shadow-xl rounded-xl z-50"
          >
            <div class="p-2 max-h-72 overflow-auto">
              <template v-if="categories.length">
                <a
                  v-for="cat in categories"
                  :key="cat"
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goToCategory(cat)"
                >
                  {{ cat }}
                </a>
              </template>
              <div v-else class="px-3 py-2 text-sm text-slate-500 text-center">
                Đang tải...
              </div>
            </div>
          </div>
        </div>

        <a
          href="javascript:void(0)"
          @click.prevent="goAuctionRoom"
          class="cursor-pointer relative text-base text-slate-800 group w-max"
        >
          <span>Phòng đấu giá</span>
          <span
            class="absolute -bottom-0.5 left-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
          <span
            class="absolute -bottom-0.5 right-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
        </a>
        <a
          href="javascript:void(0)"
          class="cursor-pointer relative text-base text-slate-800 group w-max"
        >
          <span>Kiến thức</span>
          <span
            class="absolute -bottom-0.5 left-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
          <span
            class="absolute -bottom-0.5 right-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
        </a>
        <a
          href="javascript:void(0)"
          class="cursor-pointer relative text-base text-slate-800 group w-max"
        >
          <span>Tin tức</span>
          <span
            class="absolute -bottom-0.5 left-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
          <span
            class="absolute -bottom-0.5 right-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
          ></span>
        </a>
      </nav>
      <!-- User section desktop -->
      <div class="hidden lg:flex items-center gap-1">
        <template v-if="user">
          <!-- Icon thông báo -->
          <div class="relative w-max mx-auto">
            <button
              ref="notificationButton"
              @click="toggleNotifications"
              type="button"
              id="dropdownToggle"
              class="inline-flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-50"
            >
              <font-awesome-icon :icon="faBell" class="text-xl" style="color: #0f6bae" />
              <!-- Badge số thông báo chưa đọc -->
              <span
                v-if="totalUnread > 0"
                class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
              >
                {{ totalUnread > 99 ? "99+" : totalUnread }}
              </span>
            </button>

            <!-- Dropdown thông báo -->
            <transition name="fade" appear>
              <div
                ref="notificationDropdown"
                v-if="showNotifications"
                id="dropdownMenu"
                class="absolute block left-0 bg-white py-4 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto mt-2 border border-slate-200 shadow-xl rounded-xl z-50"
                @scroll="onScroll"
              >
                <div class="flex items-center justify-between px-4 mb-4">
                  <p
                    class="text-xs text-[#0f6bae] font-medium cursor-pointer"
                    @click="clearAllNotifications"
                  >
                    Xóa tất cả
                  </p>
                  <p
                    class="text-xs text-[#0f6bae] font-medium cursor-pointer"
                    @click="markAllAsRead"
                  >
                    Đánh dấu tất cả đã đọc
                  </p>
                </div>

                <ul class="divide-y divide-gray-300">
                  <li
                    v-for="notif in notifications.slice(0, 10)"
                    :key="notif.matb"
                    :class="[
                      'dropdown-item p-4 flex items-center cursor-pointer hover:bg-gray-200',
                      { 'bg-gray-100': notif.trangthai === 'Chưa xem' },
                    ]"
                    @click="markAsRead(notif.matb)"
                  >
                    <div class="flex items-start gap-3">
                      <!-- Dot trạng thái chưa đọc -->
                      <div class="flex-shrink-0">
                        <div
                          class="w-2 h-2 bg-blue-500 rounded-full"
                          v-if="notif.trangthai === 'Chưa xem'"
                        ></div>
                      </div>
                      <!-- Nội dung thông báo -->
                      <div class="flex-1 min-w-0">
                        <h3 class="text-sm text-slate-900 font-medium">
                          {{ notif.tieude }}
                        </h3>
                        <p
                          class="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2"
                        >
                          {{ notif.noidung }}
                        </p>
                        <p class="text-xs text-[#0f6bae] font-medium leading-3 mt-2">
                          {{ formatDate(notif.thoigian) }}
                        </p>
                      </div>
                    </div>
                  </li>
                  <div
                    v-if="notifications.length === 0"
                    class="p-4 text-center text-slate-500 text-sm"
                  >
                    Không có thông báo mới
                  </div>
                </ul>
                <div v-if="loadingMore" class="text-center py-2 text-xs text-slate-500">
                  Đang tải thêm...
                </div>
                <!-- <p
                  class="text-xs px-4 mt-6 mb-4 inline-block text-[#0f6bae] font-medium cursor-pointer"
                  @click="goToAllNotifications"
                >
                  Xem tất cả thông báo
                </p> -->
              </div>
            </transition>
          </div>
          <!-- Dropdown tài khoản -->
          <div class="relative group">
            <button
              type="button"
              class="inline-flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-50"
            >
              <font-awesome-icon
                :icon="faCircleUser"
                class="text-xl"
                style="color: #0f6bae"
              />
              <span class="text-sm">{{ fullName || "Tài khoản" }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:rotate-180 top-[2px] relative"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute right-0 top-full w-56 bg-white border border-slate-200 shadow-xl rounded-xl z-100"
            >
              <div class="p-2">
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goUserInfo"
                >
                  Thông tin cá nhân
                </a>
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goRegisterProduct"
                >
                  Đăng ký tài sản
                </a>
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goProductManagement"
                >
                  Quản lý tài sản
                </a>
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goRegisteredAuctions"
                >
                  Phiên đấu đã đăng ký
                </a>
                <a
                  href="#"
                  class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                  @click.prevent="goPaymentManagement"
                >
                  Thanh toán
                </a>
                <button
                  class="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-red-700"
                  @click="logout"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-x-8">
            <button
              href="javascript:void(0)"
              @click="openLogin"
              class="cursor-pointer relative text-base text-slate-800 group w-max"
            >
              <span>Đăng nhập</span>
              <span
                class="absolute -bottom-0.5 left-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
              ></span>
              <span
                class="absolute -bottom-0.5 right-1/2 w-0 transition-all h-0.5 bg-slate-600 group-hover:w-3/6"
              ></span>
            </button>
            <button
              @click="openRegister"
              type="button"
              class="btn-flash cursor-pointer"
              style="background-image: linear-gradient(to top, #0f6bae, #1385d8)"
            >
              <span>Đăng ký tài khoản</span>
            </button>
          </div>
        </template>
      </div>

      <!-- Mobile toggle -->
      <button
        @click="mobileOpen = !mobileOpen"
        class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="lg:hidden border-t border-slate-100">
      <div class="max-w-[1200px] mx-auto px-4 py-3 space-y-1">
        <!-- Danh mục -->
        <button
          type="button"
          class="flex w-full items-center justify-between py-2 text-left"
          @click="mobileCatsOpen = !mobileCatsOpen"
        >
          <span>Danh mục tài sản</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            :class="mobileCatsOpen ? 'rotate-180' : 'rotate-0'"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <div v-show="mobileCatsOpen" class="pl-2 pb-2">
          <template v-if="categories.length">
            <a
              v-for="cat in categories"
              :key="`m-${cat}`"
              href="#"
              class="block text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
              @click.prevent="goToCategory(cat, true)"
            >
              {{ cat }}
            </a>
          </template>
          <div v-else class="text-xs text-slate-500 px-2 py-1">Đang tải danh mục…</div>
        </div>

        <a
          href="#"
          class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
          @click.prevent="goAuctionRoom"
          >Phòng đấu giá</a
        >
        <a
          href="#"
          class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
          >Kiến thức</a
        >
        <a
          href="#"
          class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
          >Tin tức</a
        >

        <!-- Tài khoản -->
        <template v-if="user">
          <a
            href="#"
            class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
            @click.prevent="goUserInfo"
            >Thông tin cá nhân</a
          >
          <a
            href="#"
            class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
            @click.prevent="goRegisterProduct"
            >Đăng ký tài sản</a
          >
          <a
            href="#"
            class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
            @click.prevent="goProductManagement"
            >Quản lý tài sản</a
          >
          <a
            href="#"
            class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
            @click.prevent="goRegisteredAuctions"
            >Phiên đấu đã đăng ký</a
          >
          <a
            href="#"
            class="block py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
            @click.prevent="goPaymentManagement"
            >Thanh toán</a
          >
          <button
            class="block w-full text-left py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-red-700"
            @click="logout"
          >
            Đăng xuất
          </button>
        </template>
        <template v-else>
          <a href="#" class="block py-2" @click.prevent="openLogin">Đăng nhập</a>
          <a href="#" class="block py-2" @click.prevent="openRegister">Đăng ký</a>
        </template>
      </div>
    </div>
  </header>
  <!-- Toast -->
  <transition name="slide-fade">
    <div v-if="toast.show" class="fixed top-5 right-5 z-50">
      <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow">
        <div class="flex items-center justify-center w-12" :class="toastMeta.barBg">
          <svg
            class="w-6 h-6 text-white fill-current"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
          >
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
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "../stores/userStore";
import { useAuctionNotificationStore } from "../stores/useAuctionNotificationStore";
import { useToastStore } from "../stores/useToastStore";
import { faBell, faCircleUser } from "@fortawesome/free-solid-svg-icons";

const API = "http://localhost:8082/api";
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const toastStore = useToastStore();
const authPopup = inject("authPopup");

// Toast
const toast = computed(() => toastStore.toast);
const toastMeta = computed(() => toastStore.toastMeta);

// Notifications
const auctionNotificationStore = useAuctionNotificationStore();
const notifications = computed(() => auctionNotificationStore.notifications);
const totalUnread = computed(() => auctionNotificationStore.totalUnread);
const showNotifications = ref(false);
const notificationDropdown = ref(null);
const notificationButton = ref(null);
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};
// Đánh dấu đã đọc
const markAsRead = async (id) => {
  await auctionNotificationStore.markAsRead(id);
};

const clearAllNotifications = async () => {
  // Xóa tất cả
  await auctionNotificationStore.clearAll();
};

const markAllAsRead = async () => {
  // Đánh dấu tất cả đã đọc
  await auctionNotificationStore.markAllAsRead();
};

// Đóng dropdown thông báo khi click ngoài
const handleClickOutside = (event) => {
  if (
    notificationDropdown.value &&
    !notificationDropdown.value.contains(event.target) &&
    notificationButton.value &&
    !notificationButton.value.contains(event.target)
  ) {
    showNotifications.value = false;
  }
};

// Watch showNotifications để add/remove listener
watch(showNotifications, (newVal) => {
  if (newVal) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
});

// Cleanup khi component unmount
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// const goToAllNotifications = () => {
//   router.push({ name: "Notifications" });
//   showNotifications.value = false;
// };

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Auth state
const user = computed(() => userStore.user);
const fullName = computed(() => {
  if (!user.value) return "";
  return `${user.value.ho} ${user.value.tenlot} ${user.value.ten}`.trim();
});

// Mobile menu state
const mobileOpen = ref(false);
const mobileCatsOpen = ref(false);

watch(mobileOpen, (open) => {
  if (!open) mobileCatsOpen.value = false;
});

watch(route, () => {
  mobileOpen.value = false;
});

// Cate
const categories = ref([]);
async function loadCategories() {
  try {
    const res = await fetch(`${API}/cates/find-all`);
    const data = await res.json();
    if (data.code === 200) {
      categories.value = data.result.map((item) => item.tendm).filter(Boolean);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API danh mục:", error);
  }
}
onMounted(loadCategories);

// Navigation
function goHome() {
  router.push({ name: "Home" });
}
function goAuctionRoom() {
  router.push({ name: "AuctionRoom" });
}
function goUserInfo() {
  router.push({ name: "UserInfo" });
}
function goRegisterProduct() {
  router.push({ name: "RegisterProduct" });
}
function goProductManagement() {
  router.push({ name: "ProductManagement" });
}
function goPaymentManagement() {
  router.push({ name: "PaymentMana" });
}
function goToCategory(cat, mobile = false) {
  router.push({ name: "SearchResults", query: { q: "", category: cat } });
  if (mobile) mobileOpen.value = false;
}
function goRegisteredAuctions() {
  router.push({ name: "RegisteredAuctions" });
}

// Logout
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
    router.push({ name: "Home" });
    toastStore.showToast("Đăng xuất thành công!", "success");
  }
}

// Auth Popup
function openLogin() {
  authPopup?.value?.open("login");
}
function openRegister() {
  authPopup?.value?.open("register");
}
const currentPage = ref(0);
const hasNext = ref(true);
const loadingMore = ref(false);

const loadMore = async () => {
  if (loadingMore.value || !hasNext.value) return;
  loadingMore.value = true;
  currentPage.value++;
  const result = await auctionNotificationStore.loadNotifications(currentPage.value, 5);
  if (result) {
    hasNext.value = !result.last && result.content.length > 0;
  }
  loadingMore.value = false;
};

const onScroll = (event) => {
  const target = event.target;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    loadMore();
  }
};

// Load ban đầu
onMounted(async () => {
  const result = await auctionNotificationStore.loadNotifications(0, 5);
  if (result) {
    hasNext.value = !result.last;
    currentPage.value = 0;
  }
});
</script>

<style scoped>
@import "@/assets/styles/toast.css";
</style>
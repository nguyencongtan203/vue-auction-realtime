<template>
  <div
    class="min-h-screen product-mana px-4 py-8 bg-gradient-to-b from-slate-50 to-white fade-in"
  >
    <!-- Header -->
    <section class="max-w-[1200px] mx-auto px-4 lg:px-6 pt-2">
      <div class="flex items-end justify-center">
        <h1
          class="text-[22px] md:text-[26px] font-semibold text-slate-900 tracking-tight pb-10"
        >
          THANH TOÁN
        </h1>
      </div>
    </section>

    <!-- Layout: Content trái + Sidebar phải -->
    <div class="max-w-[1300px] mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-start gap-8">
        <!-- LEFT: Content -->
        <div class="flex-1">
          <!-- Tabs -->
          <div class="menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3">
            <button
              :class="{ 'tab-btn--active': activeTab === 'deposit' }"
              @click="activeTab = 'deposit'"
              class="tab-btn group"
            >
              <span>Thanh toán tiền cọc</span>
            </button>
            <button
              :class="{ 'tab-btn--active': activeTab === 'win' }"
              @click="activeTab = 'win'"
              class="tab-btn group"
            >
              <span>Thanh toán thắng phiên</span>
            </button>
          </div>

          <!-- TAB: TIỀN CỌC -->
          <div v-if="activeTab === 'deposit'" class="fade-in">
            <!-- Sub-tabs -->
            <div
              class="sub-menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3"
            >
              <button
                :class="{ 'tab-btn--active': activeSubTab === 'UNPAID' }"
                @click="changeSubTab('UNPAID')"
                class="sub-tab-btn group"
              >
                <span>Chưa thanh toán</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeSubTab === 'PAID' }"
                @click="changeSubTab('PAID')"
                class="sub-tab-btn group"
              >
                <span>Đã thanh toán</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeSubTab === 'REFUNDING' }"
                @click="changeSubTab('REFUNDING')"
                class="sub-tab-btn group"
              >
                <span>Đang hoàn tiền</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeSubTab === 'REFUNDED' }"
                @click="changeSubTab('REFUNDED')"
                class="sub-tab-btn group"
              >
                <span>Đã hoàn tiền</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeSubTab === 'CANCELLED' }"
                @click="changeSubTab('CANCELLED')"
                class="sub-tab-btn group"
              >
                <span>Bị hủy</span>
              </button>
                            <button
                :class="{ 'tab-btn--active': activeSubTab === 'LOST' }"
                @click="changeSubTab('LOST')"
                class="sub-tab-btn group"
              >
                <span>Mất cọc</span>
              </button>
            </div>
            
            <div class="flex justify-end mb-4">
              <div class="relative flex-1 max-w-[200px] max-w-sm">
                <input
                  v-model="keywordDeposit"
                  type="text"
                  class="search-input w-full"
                  placeholder="Nhập mã phiếu hoặc mã phiên đấu giá"
                />
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.9 14.32a7 7 0 1 1 1.41-1.41l3.38 3.38a1 1 0 0 1-1.42 1.42l-3.37-3.39ZM8 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <!-- Loading / Error -->
            <div v-if="loading" class="flex justify-center items-center py-12 fade-in">
              <div class="flex flex-col items-center gap-3">
                <div id="wifi-loader">
                  <svg class="circle-outer" viewBox="0 0 86 86">
                    <circle class="back" cx="43" cy="43" r="40"></circle>
                    <circle class="front" cx="43" cy="43" r="40"></circle>
                    <circle class="new" cx="43" cy="43" r="40"></circle>
                  </svg>
                  <svg class="circle-middle" viewBox="0 0 60 60">
                    <circle class="back" cx="30" cy="30" r="27"></circle>
                    <circle class="front" cx="30" cy="30" r="27"></circle>
                  </svg>
                  <svg class="circle-inner" viewBox="0 0 34 34">
                    <circle class="back" cx="17" cy="17" r="14"></circle>
                    <circle class="front" cx="17" cy="17" r="14"></circle>
                  </svg>
                  <div class="text" data-text="Đang tải"></div>
                </div>
              </div>
            </div>

            <div v-else-if="error" class="text-center text-red-500 py-10 font-medium">
              {{ error }}
            </div>

            <div
              v-else-if="!deposits.length"
              class="text-center text-slate-500 py-10 italic"
            >
              Không có phiếu thanh toán tiền cọc
            </div>

            <div v-else>
              <div
                v-for="item in deposits"
                :key="item.matc"
                class="momo-invoice-card group fade-in"
              >
                <div class="invoice-header">
                  <div class="invoice-title">
                    <h3>PHIẾU THANH TOÁN</h3>
                    <p class="invoice-number">{{ item.matc }}</p>
                  </div>
                </div>
                <div class="invoice-body">
                  <div class="invoice-row">
                    <span class="invoice-label">Phiên đấu giá</span>
                    <span class="invoice-value">{{ item.phienDauGia.maphiendg }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Tài sản</span>
                    <span class="invoice-value">{{ item.phienDauGia.sanPham.tensp }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Tiền cọc</span>
                    <span class="invoice-value amount">{{ formatCurrency(item.phienDauGia.tiencoc) }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Hạn thanh toán</span>
                    <span class="invoice-value">{{ formatDate(item.thoigianthanhtoan) }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Trạng thái</span>
                    <span :class="['invoice-status', softStatus(item.trangthai)]">{{ item.trangthai }}</span>
                  </div>
                </div>
                <div class="invoice-footer">
                  <div class="invoice-total">
                    <span class="total-label">Tổng tiền</span>
                    <span class="total-amount">{{ formatCurrency(item.phienDauGia.tiencoc) }}</span>
                  </div>
                  <div class="invoice-actions">
                    <button
                      v-if="item.trangthai === 'Chưa thanh toán' && !payingItems[item.matc]"
                      @click="handlePay(item)"
                      class="btn-flash"
                    >
                      Thanh toán
                    </button>
                    <button
                      v-else-if="payingItems[item.matc]"
                      disabled
                      class="btn-flash disabled"
                    >
                      Đang chuyển hướng...
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- PHÂN TRANG deposit -->
            <section v-if="depositTotalPages > 1" class="px-6 lg:px-8 py-6 lg:py-8">
              <div
                class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
              >
                <nav
                  class="flex items-center gap-2"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <button
                    class="page-pill"
                    @click="prevDepositPage"
                    :disabled="!canPrevDeposit"
                  >
                    ‹ Trước
                  </button>
                  <button
                    v-for="n in numericPagesDeposit"
                    :key="n"
                    class="page-num"
                    :class="n === depositPage ? 'page-num--active' : ''"
                    @click="goToDepositPage(n)"
                  >
                    {{ n }}
                  </button>
                  <button
                    class="page-pill"
                    @click="nextDepositPage"
                    :disabled="!canNextDeposit"
                  >
                    Sau ›
                  </button>
                </nav>
              </div>
            </section>
          </div>

          <!-- TAB: THẮNG PHIÊN -->
          <div v-else class="fade-in">
            <!-- Sub-tabs -->
            <div
              class="sub-menu flex flex-wrap gap-3 mb-6 border-b border-slate-200 pb-3"
            >
              <button
                :class="{ 'tab-btn--active': activeWinSubTab === 'UNPAID' }"
                @click="changeWinSubTab('UNPAID')"
                class="sub-tab-btn group"
              >
                <span>Chưa thanh toán</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeWinSubTab === 'PAID' }"
                @click="changeWinSubTab('PAID')"
                class="sub-tab-btn group"
              >
                <span>Đã thanh toán</span>
              </button>
              <button
                :class="{ 'tab-btn--active': activeWinSubTab === 'CANCELLED' }"
                @click="changeWinSubTab('CANCELLED')"
                class="sub-tab-btn group"
              >
                <span>Bị hủy</span>
              </button>
            </div>
            <!-- Thanh tìm kiếm -->
            <div class="flex justify-end mb-4">
              <div class="relative flex-1 max-w-[200px] max-w-sm">
                <input
                  v-model="keywordWin"
                  type="text"
                  class="search-input w-full"
                  placeholder="Nhập mã phiếu hoặc mã phiên đấu giá"
                />
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.9 14.32a7 7 0 1 1 1.41-1.41l3.38 3.38a1 1 0 0 1-1.42 1.42l-3.37-3.39ZM8 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <!-- Loading / Error -->
            <div v-if="winLoading" class="flex justify-center items-center py-12 fade-in">
              <div class="flex flex-col items-center gap-3">
                <div id="wifi-loader">
                  <svg class="circle-outer" viewBox="0 0 86 86">
                    <circle class="back" cx="43" cy="43" r="40"></circle>
                    <circle class="front" cx="43" cy="43" r="40"></circle>
                    <circle class="new" cx="43" cy="43" r="40"></circle>
                  </svg>
                  <svg class="circle-middle" viewBox="0 0 60 60">
                    <circle class="back" cx="30" cy="30" r="27"></circle>
                    <circle class="front" cx="30" cy="30" r="27"></circle>
                  </svg>
                  <svg class="circle-inner" viewBox="0 0 34 34">
                    <circle class="back" cx="17" cy="17" r="14"></circle>
                    <circle class="front" cx="17" cy="17" r="14"></circle>
                  </svg>
                  <div class="text" data-text="Đang tải"></div>
                </div>
              </div>
            </div>

            <div v-else-if="winError" class="text-center text-red-500 py-10 font-medium">
              {{ winError }}
            </div>

            <div v-else-if="!wins.length" class="text-center text-slate-500 py-10 italic">
              Không có phiếu thanh toán phiên
            </div>

            <div v-else>
              <div
                v-for="item in wins"
                :key="item.matt"
                class="momo-invoice-card group fade-in"
              >
                <div class="invoice-header">
                  <div class="invoice-title">
                    <h3>PHIẾU THANH TOÁN</h3>
                    <p class="invoice-number">{{ item.matt }}</p>
                  </div>
                </div>
                <div class="invoice-body">
                  <div class="invoice-row">
                    <span class="invoice-label">Phiên đấu giá</span>
                    <span class="invoice-value">{{ item.phienDauGia.maphiendg }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Tài sản</span>
                    <span class="invoice-value">{{ item.phienDauGia.sanPham.tensp }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Giá thắng</span>
                    <span class="invoice-value amount">{{ formatCurrency(item.sotien) }} <small>(Đã trừ tiền cọc)</small></span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Hạn thanh toán</span>
                    <span class="invoice-value">{{ formatDate(item.thoigianthanhtoan) }}</span>
                  </div>
                  <div class="invoice-row">
                    <span class="invoice-label">Trạng thái</span>
                    <span :class="['invoice-status', softStatus(item.trangthai)]">{{ item.trangthai }}</span>
                  </div>
                </div>
                <div class="invoice-footer">
                  <div class="invoice-total">
                    <span class="total-label">Tổng tiền</span>
                    <span class="total-amount">{{ formatCurrency(item.sotien) }}</span>
                  </div>
                  <div class="invoice-actions">
                    <button
                      v-if="item.trangthai === 'Chưa thanh toán' && !payingWinItems[item.matt]"
                      @click="handleWinPay(item)"
                      class="btn-flash"
                    >
                      Thanh toán
                    </button>
                    <button
                      v-else-if="payingWinItems[item.matt]"
                      disabled
                        class="btn-flash disabled"
                      >
                      Đang chuyển hướng...
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- PHÂN TRANG win -->
            <section v-if="winTotalPages > 1" class="px-6 lg:px-8 py-6 lg:py-8">
              <div
                class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
              >
                <nav
                  class="flex items-center gap-2"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <button class="page-pill" @click="prevWinPage" :disabled="!canPrevWin">
                    ‹ Trước
                  </button>
                  <button
                    v-for="n in numericPagesWin"
                    :key="n"
                    class="page-num"
                    :class="n === winPage ? 'page-num--active' : ''"
                    @click="goToWinPage(n)"
                  >
                    {{ n }}
                  </button>
                  <button class="page-pill" @click="nextWinPage" :disabled="!canNextWin">
                    Sau ›
                  </button>
                </nav>
              </div>
            </section>
          </div>
        </div>

        <!-- RIGHT: AccountSite -->
        <div class="lg:w-[280px] lg:shrink-0 fade-in lg:sticky lg:top-10" style="padding-top: 40px;">
          <AccountSite :name="fullName || 'Tài khoản'" :verified="emailVerified" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onUnmounted, watch, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import AccountSite from "@/components/AccountSite.vue";

defineOptions({ name: "DepositPayments" });

const API = "http://localhost:8082/api";
const userStore = useUserStore();

// Computed từ store
const fullName = computed(() =>
  [userStore.user?.ho, userStore.user?.tenlot, userStore.user?.ten]
    .filter(Boolean)
    .join(" ")
);

const emailVerified = computed(() => {
  const status = (userStore.user?.xacthuctaikhoan || "").toUpperCase();
  return status === "ACTIVE" || status === "ĐÃ XÁC THỰC";
});

const deposits = ref([]);
const wins = ref([]);
const loading = ref(true);
const winLoading = ref(false);
const error = ref(null);
const winError = ref(null);
const activeTab = ref("deposit");
const activeSubTab = ref("UNPAID");
const activeWinSubTab = ref("UNPAID");
const inFlight = ref(false);
const winInFlight = ref(false);
const payingItems = ref({});
const payingWinItems = ref({});
const depositPage = ref(1);
const winPage = ref(1);
const depositPageSize = ref(4);
const winPageSize = ref(4);
const depositTotalPages = ref(1);
const winTotalPages = ref(1);
const keywordDeposit = ref("");
const keywordWin = ref("");

let abortController = null;
let winAbortController = null;
let visibilityHandlerAdded = false;

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Computed cho deposit
const canPrevDeposit = computed(() => depositPage.value > 1);
const canNextDeposit = computed(() => depositPage.value < depositTotalPages.value);

const numericPagesDeposit = computed(() => {
  const total = depositTotalPages.value;
  const p = depositPage.value;
  const windowSize = 3;
  let start = Math.max(1, p - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Computed cho win
const canPrevWin = computed(() => winPage.value > 1);
const canNextWin = computed(() => winPage.value < winTotalPages.value);

const numericPagesWin = computed(() => {
  const total = winTotalPages.value;
  const p = winPage.value;
  const windowSize = 3;
  let start = Math.max(1, p - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function softStatus(status) {
  switch (status) {
    case "Chưa thanh toán":
      return "pill-amber";
    case "Đã thanh toán":
      return "pill-green";
    case "Đang hoàn tiền":
      return "pill-orange";
    case "Đã hoàn tiền":
      return "pill-blue";
    case "Bị hủy":
      return "pill-red";
    default:
      return "pill-gray";
  }
}

async function fetchDeposits() {
  if (activeTab.value !== "deposit") return;
  loading.value = deposits.value.length === 0;
  error.value = null;
  inFlight.value = true;
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const token = userStore.token;
    if (!token) {
      error.value = "Bạn cần đăng nhập để xem phiếu thanh toán.";
      return;
    }

    const res = await axios.get(`${API}/deposit-payments/find-by-user-and-status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        status: activeSubTab.value,
        keyword: keywordDeposit.value,
        page: depositPage.value - 1,
        size: depositPageSize.value,
        sort: "thoigianthanhtoan,asc",
      },
      signal: abortController.signal,
    });

    if (res.data.code === 200) {
      const page = res.data.result;
      deposits.value = page.content || [];
      depositTotalPages.value = page.page.totalPages || 1;
    } else {
      error.value = res.data.message || "Tải dữ liệu thất bại.";
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      error.value = "Lỗi khi tải dữ liệu: " + (err?.message || "Không rõ");
    }
  } finally {
    loading.value = false;
    inFlight.value = false;
  }
}

async function fetchWins() {
  if (activeTab.value !== "win") return;
  winLoading.value = wins.value.length === 0;
  winError.value = null;
  winInFlight.value = true;
  if (winAbortController) winAbortController.abort();
  winAbortController = new AbortController();

  try {
    const token = userStore.token;
    if (!token) {
      winError.value = "Bạn cần đăng nhập để xem phiếu thanh toán.";
      return;
    }

    const res = await axios.get(`${API}/payments/find-by-user-and-status`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        status: activeWinSubTab.value,
        keyword: keywordWin.value,
        page: winPage.value - 1,
        size: winPageSize.value,
        sort: "thoigianthanhtoan,asc",
      },
      signal: winAbortController.signal,
    });

    if (res.data.code === 200) {
      const page = res.data.result;
      wins.value = page.content || [];
      winTotalPages.value = page.page.totalPages || 1;
    } else {
      winError.value = res.data.message || "Tải dữ liệu thất bại.";
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      winError.value = "Lỗi khi tải dữ liệu: " + (err?.message || "Không rõ");
    }
  } finally {
    winLoading.value = false;
    winInFlight.value = false;
  }
}

function changeSubTab(newTab) {
  activeSubTab.value = newTab;
  depositPage.value = 1;
  fetchDeposits();
}

function changeWinSubTab(newTab) {
  activeWinSubTab.value = newTab;
  winPage.value = 1;
  fetchWins();
}

function goToDepositPage(n) {
  goToPage(n);
}

function goToPage(n) {
  const safe = Math.min(Math.max(1, n), depositTotalPages.value);
  if (safe !== depositPage.value) {
    depositPage.value = safe;
    fetchDeposits();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevDepositPage() {
  if (canPrevDeposit.value) goToPage(depositPage.value - 1);
}

function nextDepositPage() {
  if (canNextDeposit.value) goToPage(depositPage.value + 1);
}

function goToWinPage(n) {
  const safe = Math.min(Math.max(1, n), winTotalPages.value);
  if (safe !== winPage.value) {
    winPage.value = safe;
    fetchWins();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevWinPage() {
  if (canPrevWin.value) goToWinPage(winPage.value - 1);
}

function nextWinPage() {
  if (canNextWin.value) goToWinPage(winPage.value + 1);
}

function onDepositChanged() {
  fetchDeposits();
}

function onWinChanged() {
  fetchWins();
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    fetchDeposits();
    fetchWins();
  }
}

async function handlePay(item) {
  payingItems.value[item.matc] = true;
  try {
    const token = userStore.token;
    const res = await axios.get(`${API}/deposit-payments/create-order`, {
      params: {
        matc: item.matc,
        amount: item.phienDauGia.tiencoc,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.code === 200) {
      window.location.href = res.data.result;
    } else {
      alert(res.data.message || "Tạo URL thanh toán thất bại");
      payingItems.value[item.matc] = false;
    }
  } catch (err) {
    payingItems.value[item.matc] = false;
  }
}

async function handleWinPay(item) {
  payingWinItems.value[item.matt] = true;
  try {
    const token = userStore.token;
    const res = await axios.get(`${API}/payments/create-order`, {
      params: {
        matt: item.matt,
        amount: item.sotien,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.code === 200) {
      window.location.href = res.data.result;
    } else {
      alert(res.data.message || "Tạo URL thanh toán thất bại");
      payingWinItems.value[item.matt] = false;
    }
  } catch (err) {
    payingWinItems.value[item.matt] = false;
  }
}

// Watch keyword với debounce
watch(
  keywordDeposit,
  debounce(() => {
    depositPage.value = 1;
    fetchDeposits();
  }, 700)
);

watch(
  keywordWin,
  debounce(() => {
    winPage.value = 1;
    fetchWins();
  }, 700)
);

watch(activeTab, (tab) => {
  if (tab === "deposit") fetchDeposits();
  else if (tab === "win") fetchWins();
});

onActivated(() => {
  fetchDeposits();
  fetchWins();
});

onMounted(() => {
  fetchDeposits();
  fetchWins();
  window.addEventListener("deposit-payments:changed", onDepositChanged);
  window.addEventListener("win-payments:changed", onWinChanged);
  if (!visibilityHandlerAdded) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    visibilityHandlerAdded = true;
  }
});

onUnmounted(() => {
  window.removeEventListener("deposit-payments:changed", onDepositChanged);
  window.removeEventListener("win-payments:changed", onWinChanged);
  if (visibilityHandlerAdded) {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    visibilityHandlerAdded = false;
  }
  if (abortController) abortController.abort();
  if (winAbortController) winAbortController.abort();
});
</script>

<style scoped>
@import "@/assets/styles/home.css";

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.soft-empty {
  background: linear-gradient(to right, #f9fafb, #f4f7fa);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  text-align: center;
  color: #64748b;
  box-shadow: 0 4px 18px -6px rgba(99, 115, 129, 0.25);
}

.momo-invoice-card {
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.momo-invoice-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.invoice-header {
  background: #0f6bae;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.invoice-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.invoice-number {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.invoice-body {
  padding: 1rem;
}

.invoice-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.invoice-row:last-child {
  border-bottom: none;
}

.invoice-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.invoice-value {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
  text-align: right;
}

.invoice-value.amount {
  color: #059669;
}

.invoice-status {
  padding: .28rem .55rem;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .5px;
  border-radius: 999px;
  display: inline-block;
  min-width: 70px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .06);
}

.invoice-status.pill-green {
  background: #e7f9ef;
  color: #16823d;
}

.invoice-status.pill-amber {
  background: #fff5d9;
  color: #b86e00;
}

.invoice-status.pill-orange {
  background: #fed7aa;
  color: #9a3412;
}

.invoice-status.pill-blue {
  background: #dbeafe;
  color: #1e40af;
}

.invoice-status.pill-red {
  background: #ffe9e9;
  color: #c03636;
}

.invoice-status.pill-gray {
  background: #f1f5f9;
  color: #64748b;
}

.invoice-footer {
  padding: 1rem;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invoice-total {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 12px;
  color: #6b7280;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #111827;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
.pager-btn {
  background: linear-gradient(to bottom, #fdfdfd, #f6f7f9);
  border: 1px solid #d9dce2;
  color: #475569;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.25s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.pager-btn:hover:not(:disabled) {
  background: #eef6ff;
  border-color: #bcd7f8;
  color: #0f172a;
}
.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pager-info {
  font-size: 0.85rem;
  color: #64748b;
}
@media (max-width: 768px) {
  .momo-invoice-card {
    margin-bottom: 1rem;
  }
  .invoice-header {
    flex-direction: column;
    text-align: center;
  }
  .invoice-footer {
    flex-direction: column;
    gap: 1rem;
  }
}

.search-input {
  @apply h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400;
}
</style>
<template>
  <!-- ProductMana.vue -->
  <div
    class="min-h-screen product-mana px-4 py-8 bg-gradient-to-b from-slate-50 to-white"
  >
    <section class="max-w-[1200px] mx-auto px-4 lg:px-6 pt-2">
      <div class="flex items-end justify-center">
        <h1
          class="text-[22px] md:text-[26px] font-semibold text-slate-900 tracking-tight pb-10"
        >
          QUẢN LÝ TÀI SẢN
        </h1>
      </div>
    </section>

    <!-- Layout: Content trái + Sidebar phải -->
    <div class="max-w-[1300px] mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-start gap-8">
        <!-- LEFT: Content -->
        <div class="flex-1">
          <!-- Danh sách sản phẩm -->
          <div v-if="activeTab === 'products'">
            <div class="max-w-[1000px] mx-auto">
              <!-- Tabs with search -->
              <div class="flex justify-between items-center gap-3 mb-6 pb-1">
                <!-- Tabs (justify-start) -->
                <div class="flex flex-wrap gap-3">
                  <button
                    :class="{ 'tab-btn--active': activeTab === 'products' }"
                    @click="activeTab = 'products'"
                    class="tab-btn group"
                  >
                    <span>Tài sản đã đăng ký</span>
                  </button>
                  <button
                    :class="{ 'tab-btn--active': activeTab === 'auctions' }"
                    @click="activeTab = 'auctions'"
                    class="tab-btn group"
                  >
                    <span>Phiên đấu giá</span>
                  </button>
                </div>

                <!-- Search (justify-end) -->
                <div class="relative flex-1 max-w-[200px] max-w-sm rounded-[22px]">
                  <input
                    v-model="currentKeyword"
                    type="text"
                    class="search-input w-full"
                    :placeholder="
                      activeTab === 'products'
                        ? 'Nhập mã/tên sản phẩm'
                        : 'Nhập mã phiên đấu giá'
                    "
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

              <div class="table-shell fade-in">
                <table class="soft-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Mã tài sản</th>
                      <th>Tên tài sản</th>
                      <th>Trạng thái</th>
                      <th>Tác vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="p in filteredProducts" :key="p.masp">
                      <tr class="data-row">
                        <td>
                          <div class="img-cell h-32">
                            <template v-if="p.hinhAnh?.length">
                              <img
                                :src="getImageUrl(p.hinhAnh[0].tenanh)"
                                class="product-main-img no-hover"
                                :alt="p.tensp"
                              />
                            </template>
                            <template v-else>
                              <span class="placeholder">Không có ảnh</span>
                            </template>
                          </div>
                        </td>
                        <td class="text-left font-medium text-slate-700">
                          <span class="line-clamp-2">{{ p.masp }}</span>
                        </td>
                        <td class="text-left font-medium text-slate-700">
                          <span class="line-clamp-2">{{ p.tensp }}</span>
                        </td>
                        <td>
                          <span :class="['status-pill', statusColor(p.trangthai)]">
                            {{ p.trangthai }}
                          </span>
                        </td>
                        <td>
                          <div class="flex flex-wrap gap-2 justify-center">
                            <template v-if="p.trangthai !== 'Đã duyệt'">
                              <button class="soft-btn blue" @click="openEdit(p)">
                                Chỉnh sửa
                              </button>
                            </template>
                            <template v-else>
                              <button class="soft-btn green" @click="openAuction(p)">
                                Tạo phiên
                              </button>
                            </template>
                            <button class="soft-btn neutral" @click="toggleDetails(p.masp)">
                              Chi tiết
                            </button>
                            <button class="soft-btn red" @click="confirmDeleteProduct(p.masp)">
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                      <!-- Dropdown row -->
                      <tr class="details-row">
                        <td :colspan="5" class="p-0">
                          <transition name="expand">
                            <div v-if="openedDetails === p.masp" class="dropdown-panel">
                              <div class="panel-inner">
                                <div class="panel-col">
                                  <div class="panel-label">Ảnh khác</div>
                                  <div v-if="p.hinhAnh?.length > 1" class="thumb-grid">
                                    <img
                                      v-for="(img, idx) in p.hinhAnh.slice(1)"
                                      :key="idx"
                                      :src="getImageUrl(img.tenanh)"
                                      class="dropdown-img no-hover"
                                      :alt="`Ảnh phụ ${idx + 1}`"
                                    />
                                  </div>
                                  <div v-else class="placeholder small">Không có ảnh thêm</div>
                                </div>
                                <div class="panel-col">
                                  <div class="panel-label">Thành phố</div>
                                  <div class="panel-value">{{ p.thanhPho?.tentp || "N/A" }}</div>
                                </div>
                                <div class="panel-col">
                                  <div class="panel-label">Tình trạng</div>
                                  <div class="panel-value">{{ p.tinhtrangsp || "—" }}</div>
                                </div>
                                <div class="panel-col">
                                  <div class="panel-label">Danh mục</div>
                                  <div class="panel-value">{{ p.danhMuc?.tendm || "N/A" }}</div>
                                </div>
                                <div class="panel-col">
                                  <div class="panel-label">Giá mong đợi</div>
                                  <div class="panel-value">{{ formatPrice(p.giamongdoi) }}</div>
                                </div>
                              </div>
                            </div>
                          </transition>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <div v-if="!filteredProducts.length" class="mt-6 text-slate-500 text-center italic">
                Không có sản phẩm nào.
              </div>

              <!-- PHÂN TRANG cho products -->
              <section v-if="productTotalPages > 1" class="px-6 lg:px-8 py-6 lg:py-8">
                <div
                  class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
                >
                  <nav class="flex items-center gap-2" role="navigation" aria-label="Pagination" style="padding-right: 1px;">
                    <button
                      class="page-pill"
                      @click="prevProductsPage"
                      :disabled="!canPrevProducts"
                    >
                    ‹ Trước
                    </button>
                    <button
                      v-for="n in numericPagesProducts"
                      :key="n"
                      class="page-num"
                      :class="n === productPage ? 'page-num--active' : ''"
                      @click="goToProductsPage(n)"
                    >
                      {{ n }}
                    </button>
                    <button
                      class="page-pill"
                      @click="nextProductsPage"
                      :disabled="!canNextProducts"
                    >
                      Sau ›
                    </button>
                  </nav>
                </div>
              </section>
            </div>
          </div>

          <!-- Danh sách phiên đấu giá -->
          <div v-else>
            <div class="max-w-[1000px] mx-auto">
              <!-- Tabs with search -->
              <div class="flex justify-between items-center gap-3 mb-6 pb-1">
                <!-- Tabs (justify-start) -->
                <div class="flex flex-wrap gap-3">
                  <button
                    :class="{ 'tab-btn--active': activeTab === 'products' }"
                    @click="activeTab = 'products'"
                    class="tab-btn group"
                  >
                    <span>Tài sản đã đăng ký</span>
                  </button>
                  <button
                    :class="{ 'tab-btn--active': activeTab === 'auctions' }"
                    @click="activeTab = 'auctions'"
                    class="tab-btn group"
                  >
                    <span>Phiên đấu giá</span>
                  </button>
                </div>

                <!-- Search (justify-end) -->
                <div class="relative flex-1 max-w-[200px] max-w-sm ">
                  <input
                    v-model="currentKeyword"
                    type="text"
                    class="search-input w-full"
                    :placeholder="
                      activeTab === 'products'
                        ? 'Nhập mã/tên sản phẩm'
                        : 'Nhập mã phiên đấu giá'
                    "
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

              <div class="table-shell fade-in">
                <table class="soft-table">
                  <thead>
                    <tr>
                      <th>Mã phiên</th>
                      <th>Giá khởi điểm</th>
                      <th>Bước giá</th>
                      <th>Tiền cọc</th>
                      <th>Giá cao nhất</th>
                      <th>Trạng thái</th>
                      <th>Người tham gia</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="a in auctions" :key="a.maphiendg" class="data-row">
                      <td class="text-left font-medium text-slate-700">
                        <span class="line-clamp-2">{{ a.maphiendg }}</span>
                      </td>
                      <td>{{ formatPrice(a.giakhoidiem) }}</td>
                      <td>{{ formatPrice(a.buocgia) }}</td>
                      <td>{{ formatPrice(a.tiencoc) }}</td>
                      <td>{{ formatPrice(a.giacaonhatdatduoc) }}</td>
                      <td>
                        <span :class="['status-pill', statusColor(a.trangthai)]">
                          {{ a.trangthai }}
                        </span>
                      </td>
                      <td>{{ a.slnguoithamgia }}</td>
                      <td>
                        <div class="flex flex-wrap gap-2 justify-center">
                          <template v-if="a.trangthai == 'Chờ duyệt'">
                            <button class="soft-btn blue" @click="openEditedAuction(a)">
                              Chỉnh sửa
                            </button>
                            <!-- nút Xóa cho phiên chưa duyệt -->
                            <button class="soft-btn red" @click="confirmDeleteAuction(a.maphiendg)">
                              Xóa
                            </button>
                          </template>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="!auctions.length" class="mt-6 text-slate-500 text-center italic">
                Không có phiên đấu giá nào.
              </div>

              <section v-if="auctionTotalPages > 1" class="px-6 lg:px-8 py-6 lg:py-8">
                <div
                  class="mt-8 flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-center"
                >
                  <nav class="flex items-center gap-2" role="navigation" aria-label="Pagination">
                    <button
                      class="page-pill"
                      @click="prevAuctionsPage"
                      :disabled="!canPrevAuctions"
                    >
                      ‹ Trước
                    </button>
                    <button
                      v-for="n in numericPagesAuctions"
                      :key="n"
                      class="page-num"
                      :class="n === auctionPage ? 'page-num--active' : ''"
                      @click="goToAuctionsPage(n)"
                    >
                      {{ n }}
                    </button>
                    <button
                      class="page-pill"
                      @click="nextAuctionsPage"
                      :disabled="!canNextAuctions"
                    >
                      Sau ›
                    </button>
                  </nav>
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- RIGHT: AccountSite -->
        <div class="lg:w-[280px] lg:shrink-0 fade-in lg:sticky lg:top-10" style="padding-top: 72px;">
          <AccountSite :name="fullName || 'Tài khoản'" :verified="emailVerified" />
        </div>
      </div>
    </div>

    <!-- Popup -->
    <UpdateProduct
      :visible="showUpdatePopup"
      :product="editedProduct"
      @close="showUpdatePopup = false"
      @updated="handleUpdated"
    />
    <CreateAuction
      :visible="showAuctionPopup"
      :product="auctionProduct"
      @close="showAuctionPopup = false"
      @created="handleAuctionCreated"
    />
    <UpdateAuction
      :visible="showUpdateAuctionPopup"
      :auction="editedAuction"
      @close="showUpdateAuctionPopup = false"
      @updated="handleAuctionUpdated"
    />
    <PopupSubmit
      :visible="showConfirmPopup"
      :message="confirmMessage"
      actionType="delete"
      @close="showConfirmPopup = false"
      @submit="handleConfirmDelete"
    />

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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, onUnmounted, computed, watch } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import UpdateProduct from "@/components/UpdateProduct.vue";
import CreateAuction from "@/components/CreateAuction.vue";
import UpdateAuction from "@/components/UpdateAuction.vue";
import PopupSubmit from "@/components/PopupSubmit.vue";
import AccountSite from "@/components/AccountSite.vue";

defineOptions({ name: "ProductManagement" });

const API = "http://localhost:8082/api";
const userStore = useUserStore();

// Computed từ store
const fullName = computed(() =>
  [userStore.user?.ho, userStore.user?.tenlot, userStore.user?.ten].filter(Boolean).join(" ")
);

const emailVerified = computed(() => {
  const status = (userStore.user?.xacthuctaikhoan || "").toUpperCase();
  return status === "ACTIVE" || status === "ĐÃ XÁC THỰC";
});

// Reactive state
const activeTab = ref("products");
const products = ref([]);
const auctions = ref([]);
const openedDetails = ref(null);

const showUpdatePopup = ref(false);
const showAuctionPopup = ref(false);
const showUpdateAuctionPopup = ref(false);
const editedProduct = ref(null);
const auctionProduct = ref(null);
const editedAuction = ref(null);
const showConfirmPopup = ref(false);
const confirmMessage = ref("");
const productToDelete = ref("");
const auctionToDelete = ref("");
const deleteTarget = ref("product");

const productPage = ref(1);
const productPageSize = ref(5);
const productTotalPages = ref(1);

const auctionPage = ref(1);
const auctionPageSize = ref(5);
const auctionTotalPages = ref(1);

const keywordProducts = ref("");
const keywordAuctions = ref("");

const toast = reactive({ show: false, message: "", type: "success" });

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Computed
const filteredProducts = computed(() =>
  products.value.filter((p) => ["Đã duyệt", "Chờ duyệt", "Đã hủy"].includes(p.trangthai))
);

const canPrevProducts = computed(() => productPage.value > 1);
const canNextProducts = computed(() => productPage.value < productTotalPages.value);

const canPrevAuctions = computed(() => auctionPage.value > 1);
const canNextAuctions = computed(() => auctionPage.value < auctionTotalPages.value);

const currentKeyword = computed({
  get: () =>
    activeTab.value === "products" ? keywordProducts.value : keywordAuctions.value,
  set: (value) => {
    if (activeTab.value === "products") {
      keywordProducts.value = value;
    } else {
      keywordAuctions.value = value;
    }
  },
});
const numericPagesProducts = computed(() => {
  const total = productTotalPages.value;
  const p = productPage.value;
  const windowSize = 3;
  let start = Math.max(1, p - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const numericPagesAuctions = computed(() => {
  const total = auctionTotalPages.value;
  const p = auctionPage.value;
  const windowSize = 3;
  let start = Math.max(1, p - Math.floor(windowSize / 2));
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - windowSize + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const toastMeta = computed(() => {
  const type = String(toast.type || "info").toLowerCase();
  if (type === "success") {
    return {
      title: "Thành công!",
      barBg: "bg-emerald-500",
      titleColor: "text-emerald-500",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z",
      ],
    };
  }
  if (type === "warning") {
    return {
      title: "Cảnh báo!",
      barBg: "bg-yellow-400",
      titleColor: "text-yellow-400",
      iconPaths: [
        "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
      ],
    };
  }
  if (type === "error") {
    return {
      title: "Lỗi!",
      barBg: "bg-red-500",
      titleColor: "text-red-500",
      iconPaths: [
        "M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z",
      ],
    };
  }
  return {
    title: "Thông báo",
    barBg: "bg-blue-500",
    titleColor: "text-blue-500",
    iconPaths: [
      "M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331Z",
      "M21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z",
    ],
  };
});

// Watch
watch(activeTab, (tab) => {
  if (tab === "products") fetchProducts();
  else fetchAuctions();
});

// Watch keyword với debounce
watch(
  keywordProducts,
  debounce(() => {
    productPage.value = 1;
    fetchProducts();
  }, 700)
);

watch(
  keywordAuctions,
  debounce(() => {
    auctionPage.value = 1;
    fetchAuctions();
  }, 700)
);

// Functions
const getImageUrl = (tenanh) => `${API}/imgs/${tenanh}`;

const toggleDetails = (masp) => {
  openedDetails.value = openedDetails.value === masp ? null : masp;
};

const openEdit = (product) => {
  editedProduct.value = JSON.parse(JSON.stringify(product));
  showUpdatePopup.value = true;
};

const openAuction = (product) => {
  auctionProduct.value = JSON.parse(JSON.stringify(product));
  showAuctionPopup.value = true;
};

const openEditedAuction = (auction) => {
  editedAuction.value = JSON.parse(JSON.stringify(auction));
  showUpdateAuctionPopup.value = true;
};

const handleUpdated = async () => {
  await fetchProducts();
  showUpdatePopup.value = false;
};

const handleAuctionCreated = async () => {
  await fetchAuctions();
  if (activeTab.value === "products") await fetchProducts();
  showAuctionPopup.value = false;
};

const handleAuctionUpdated = async () => {
  await fetchAuctions();
  if (activeTab.value === "products") await fetchProducts();
  showUpdateAuctionPopup.value = false;
};

async function fetchProducts() {
  try {
    const token = userStore.token;
    if (!token) return;
    const res = await axios.get(`${API}/products/find-by-user`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        keyword: keywordProducts.value,
        page: productPage.value - 1,
        size: productPageSize.value,
        sort: "masp,asc",
      },
    });
    if (res.data?.code === 200 && res.data.result) {
      const pg = res.data.result;
      products.value = pg.content || [];
      productTotalPages.value = pg.page?.totalPages || 1;
    } else {
      products.value = [];
      productTotalPages.value = 1;
    }
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
}

async function fetchAuctions() {
  try {
    const token = userStore.token;
    if (!token) return;
    const res = await axios.get(`${API}/auctions/find-by-user`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        keyword: keywordAuctions.value,
        page: auctionPage.value - 1,
        size: auctionPageSize.value,
        sort: "thoigianbd,desc",
      },
    });
    if (res.data?.code === 200 && res.data.result) {
      const pg = res.data.result;
      auctions.value = pg.content || [];
      auctionTotalPages.value = pg.page?.totalPages || 1;
    } else {
      auctions.value = [];
      auctionTotalPages.value = 1;
    }
  } catch (err) {
    console.error("Lỗi khi tải phiên đấu giá:", err);
  }
}

function goProductsPage(n) {
  const safe = Math.min(Math.max(1, n), productTotalPages.value);
  if (safe !== productPage.value) {
    productPage.value = safe;
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevProductsPage() {
  if (canPrevProducts.value) goProductsPage(productPage.value - 1);
}

function nextProductsPage() {
  if (canNextProducts.value) goProductsPage(productPage.value + 1);
}

function goToProductsPage(n) {
  goProductsPage(n);
}

function goAuctionsPage(n) {
  const safe = Math.min(Math.max(1, n), auctionTotalPages.value);
  if (safe !== auctionPage.value) {
    auctionPage.value = safe;
    fetchAuctions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function prevAuctionsPage() {
  if (canPrevAuctions.value) goAuctionsPage(auctionPage.value - 1);
}

function nextAuctionsPage() {
  if (canNextAuctions.value) goAuctionsPage(auctionPage.value + 1);
}

function goToAuctionsPage(n) {
  goAuctionsPage(n);
}

function statusColor(st) {
  switch (st) {
    case "Đã duyệt":
      return "pill-green";
    case "Chờ duyệt":
      return "pill-amber";
    case "Đã hủy":
      return "pill-red";
    default:
      return "pill-gray";
  }
}

const formatPrice = (price) => {
  if (price == null || price === undefined) return "N/A";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );
};

function showToast(msg, type = "success") {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => (toast.show = false), 2500);
}

const confirmDeleteProduct = (masp) => {
  confirmMessage.value = "Bạn có chắc muốn xóa sản phẩm này?";
  productToDelete.value = masp;
  auctionToDelete.value = "";
  deleteTarget.value = "product";
  showConfirmPopup.value = true;
};

const confirmDeleteAuction = (maphiendg) => {
  confirmMessage.value = "Bạn có chắc muốn xóa phiên đấu giá này?";
  auctionToDelete.value = maphiendg;
  productToDelete.value = "";
  deleteTarget.value = "auction";
  showConfirmPopup.value = true;
};

const handleConfirmDelete = () => {
  if (deleteTarget.value === "product" && productToDelete.value) {
    deleteProduct(productToDelete.value);
  } else if (deleteTarget.value === "auction" && auctionToDelete.value) {
    deleteAuction(auctionToDelete.value);
  }
  // Reset and close
  showConfirmPopup.value = false;
  productToDelete.value = "";
  auctionToDelete.value = "";
  deleteTarget.value = "product";
};

async function deleteProduct(masp) {
  try {
    const token = userStore.token;
    if (!token) {
      showToast("Không tìm thấy token!", "error");
      return;
    }
    const res = await axios.delete(`${API}/products/delete/${masp}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { code, message } = res.data;
    if (code === 200) {
      showToast(message, "success");
      await fetchProducts();
    } else {
      showToast(message, "error");
    }
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
    showToast("Lỗi mạng hoặc server!", "error");
  }
}

async function deleteAuction(maphiendg) {
  try {
    const token = userStore.token;
    if (!token) {
      showToast("Không tìm thấy token!", "error");
      return;
    }
    const res = await axios.delete(`${API}/auctions/delete/${maphiendg}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { code, message } = res.data;
    if (code === 200) {
      showToast(message || "Xóa phiên thành công!", "success");
      await fetchAuctions();
      if (activeTab.value === "products") await fetchProducts();
    } else {
      showToast(message || "Xóa thất bại!", "error");
    }
  } catch (err) {
    console.error("Lỗi khi xóa phiên:", err);
    showToast("Lỗi mạng hoặc server!", "error");
  }
}

function onProductsChanged() {
  productPage.value = 1;
  fetchProducts();
}

function onAuctionsChanged() {
  auctionPage.value = 1;
  fetchAuctions();
}

// Lifecycle
onActivated(() => {
  if (activeTab.value === "products") fetchProducts();
  else fetchAuctions();
});

onMounted(() => {
  fetchProducts();
  fetchAuctions();
  window.addEventListener("products:changed", onProductsChanged);
  window.addEventListener("auctions:changed", onAuctionsChanged);
});

onUnmounted(() => {
  window.removeEventListener("products:changed", onProductsChanged);
  window.removeEventListener("auctions:changed", onAuctionsChanged);
});
</script>

<style scoped>
@import "@/assets/styles/productmana.css";
@import "@/assets/styles/toast.css";
@import "@/assets/styles/home.css";

.search-input {
  @apply h-11 rounded-[12px] border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400;
}
</style>
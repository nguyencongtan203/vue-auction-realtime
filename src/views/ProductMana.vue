<template>
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
    <!-- Tabs -->
    <div class="max-w-[1400px] mx-auto menu flex flex-wrap gap-3 mb-6 pb-1">
      <button
        :class="{ 'tab-btn--active': activeTab === 'products' }"
        @click="activeTab = 'products'"
        class="tab-btn group"
      >
       <span>Sản phẩm đã đăng ký</span> 
      </button>
      <button
        :class="{ 'tab-btn--active': activeTab === 'auctions' }"
        @click="activeTab = 'auctions'"
        class="tab-btn group"
      >
        <span>Phiên đấu giá</span>
      </button>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-if="activeTab === 'products'" class="max-w-[1400px] mx-auto">
      <div class="table-shell fade-in">
        <table class="soft-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Mã sản phẩm</th>
              <th>Tên sản phẩm</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
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

                <!-- Mã sản phẩm hiển thị giống tên sản phẩm -->
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
                    <button class="soft-btn neutral" @click="toggleDetails(p.masp)">
                      Chi tiết
                    </button>

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
                          <div class="panel-label">Giá ước tính</div>
                          <div class="panel-value">{{ formatPrice(p.giathapnhat) }} - {{ formatPrice(p.giacaonhat) }}</div>
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

      <!-- Pager -->
      <div class="pager">
        <button class="pager-btn" @click="prevProductsPage" :disabled="productPage <= 1">
          ‹ Prev
        </button>
        <span class="pager-info">
          Trang <strong>{{ productPage }}</strong> / {{ productTotalPages }}
        </span>
        <button
          class="pager-btn"
          @click="nextProductsPage"
          :disabled="productPage >= productTotalPages"
        >
          Next ›
        </button>
      </div>
    </div>

    <!-- Danh sách phiên đấu giá -->
    <div v-else class="max-w-[1400px] mx-auto">
      <div class="table-shell fade-in">
        <table class="soft-table">
          <thead>
            <tr>
              <th>Mã phiên</th>
              <th>Giá khởi điểm</th>
              <th>Giá trần</th>
              <th>Bước giá</th>
              <th>Tiền cọc</th>
              <th>Giá cao nhất</th>
              <th>Trạng thái</th>
              <th>Kết quả</th>
              <th>Người tham gia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in auctions" :key="a.maphiendg" class="data-row">
              <td class="text-left font-medium text-slate-700">
                <span class="line-clamp-2">{{ a.maphiendg }}</span>
              </td>
              <td>{{ formatPrice(a.giakhoidiem) }}</td>
              <td>{{ formatPrice(a.giatran) }}</td>
              <td>{{ formatPrice(a.buocgia) }}</td>
              <td>{{ formatPrice(a.tiencoc) }}</td>
              <td>{{ formatPrice(a.giacaonhatdatduoc) }}</td>
              <td>
                <span :class="['status-pill', statusColor(a.trangthai)]">
                  {{ a.trangthai }}
                </span>
              </td>
              <td>{{ a.ketquaphien || "—" }}</td>
              <td>{{ a.slnguoithamgia }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!auctions.length" class="mt-6 text-slate-500 text-center italic">
        Không có phiên đấu giá nào.
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
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onUnmounted, computed, watch } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import UpdateProduct from "@/components/UpdateProduct.vue";
import CreateAuction from "@/components/CreateAuction.vue";

defineOptions({ name: "ProductManagement" });

const API = "http://localhost:8082/api";
const activeTab = ref("products");
const products = ref([]);
const auctions = ref([]);
const openedDetails = ref(null);

const showUpdatePopup = ref(false);
const showAuctionPopup = ref(false);

const editedProduct = ref(null);
const auctionProduct = ref(null);

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

const handleUpdated = async () => {
  await fetchProducts();
  showUpdatePopup.value = false;
};

const handleAuctionCreated = async () => {
  await fetchAuctions();
  showAuctionPopup.value = false;
};

const filteredProducts = computed(() =>
  products.value.filter((p) => ["Đã duyệt", "Chờ duyệt", "Đã hủy"].includes(p.trangthai))
);

const productPage = ref(1);
const productPageSize = ref(8);
const productTotalPages = ref(1);

async function fetchProducts() {
  try {
    const token = Cookies.get("jwt_token");
    if (!token) return;
    const res = await axios.get(`${API}/products/find-by-user`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: productPage.value - 1,
        size: productPageSize.value,
        sort: "masp,asc",
      },
    });
    if (res.data?.code === 200 && res.data.result) {
      const pg = res.data.result;
      products.value = pg.content || [];
      productTotalPages.value = pg.totalPages || 1;
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
    const token = Cookies.get("jwt_token");
    if (!token) return;
    const res = await axios.get(`${API}/auctions/find-by-user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data?.code === 200) {
      auctions.value = res.data.result || [];
    } else {
      auctions.value = [];
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
  if (productPage.value > 1) goProductsPage(productPage.value - 1);
}
function nextProductsPage() {
  if (productPage.value < productTotalPages.value) goProductsPage(productPage.value + 1);
}

watch(activeTab, (tab) => {
  if (tab === "products") fetchProducts();
  else fetchAuctions();
});

onActivated(() => {
  if (activeTab.value === "products") fetchProducts();
  else fetchAuctions();
});

function onProductsChanged() {
  productPage.value = 1;
  fetchProducts();
}
function onAuctionsChanged() {
  fetchAuctions();
}

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

// Helper trạng thái → màu
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

// Format giá tiền VND
const formatPrice = (price) => {
  if (price == null || price === undefined) return "N/A";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
</script>

<style scoped>
@import "@/assets/styles/productmana.css";
@media (max-width: 768px) {
  .table-shell {
    overflow-x: auto;
  }
  .soft-table {
    font-size: 0.875rem;
    min-width: 600px;
  }
  .data-row td {
    padding: 0.5rem;
  }
  .details-row .panel-inner {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .menu {
    justify-content: center;
  }
}
</style>
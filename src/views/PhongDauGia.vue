<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">D</div>
          <span class="font-semibold">DauGiaLive.vn</span>
        </div>

        <!-- NAV desktop -->
        <nav class="hidden lg:flex items-center gap-8 text-sm">
          <!-- Danh mục tài sản + dropdown -->
          <div class="relative group">
            <a href="#" class="hover:text-sky-600 inline-flex items-center gap-1" @click.prevent tabindex="0">
              Danh mục tài sản
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
            </a>
            <!-- Dropdown desktop -->
            <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-0 top-full w-50 bg-white border border-slate-200 shadow-xl rounded-xl z-50">
              <div class="p-2 max-h-72 overflow-auto">
                <template v-if="categories && categories.length">
                  <a
                    v-for="cat in categories"
                    :key="cat"
                    href="#"
                    class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                    @click.prevent="goSearchCategory(cat)"
                  >
                    {{ cat }}
                  </a>
                </template>
                <div v-else class="px-3 py-2 text-sm text-slate-500">Đang tải danh mục…</div>
              </div>
            </div>
          </div>

          <a href="/phong-dau-gia" class="hover:text-sky-600">Phòng đấu giá</a>
          <a href="#" class="hover:text-sky-600">Kiến thức</a>
          <a href="#" class="hover:text-sky-600">Tin tức</a>
        </nav>

        <!-- User section desktop -->
        <div class="hidden lg:flex items-center gap-4">
          <template v-if="user">
            <div class="relative group">
              <button type="button" class="inline-flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-50">
                <font-awesome-icon icon="user" class="text-xl" />
                <span class="text-sm">{{ fullName || 'Tài khoản' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute right-0 top-full w-56 bg-white border border-slate-200 shadow-xl rounded-xl z-50">
                <div class="p-2">
                  <a href="#" class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700" @click.prevent="goProfile">Thông tin cá nhân</a>
                  <button class="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700" @click="logout">Đăng xuất</button>
                </div>
              </div>
            </div>
          </template>
          <button v-else @click="goLogin" class="text-sm hover:text-sky-600">Đăng nhập</button>
        </div>

        <!-- Mobile menu button -->
        <button @click="mobileOpen = !mobileOpen" class="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileOpen" class="lg:hidden border-t border-slate-100">
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-3 space-y-1">
          <!-- Danh mục -->
          <button type="button" class="flex w-full items-center justify-between py-2 text-left" @click="mobileCatsOpen = !mobileCatsOpen" :aria-expanded="mobileCatsOpen" aria-controls="mobile-categories">
            <span>Danh mục tài sản</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="mobileCatsOpen ? 'rotate-180' : 'rotate-0'" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          <div id="mobile-categories" v-show="mobileCatsOpen" class="pl-2 pb-2">
            <div v-if="categories && categories.length" class="grid grid-cols-2 gap-2">
              <a v-for="cat in categories" :key="'m-' + cat" href="#" class="block text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50" @click.prevent="selectMobileCategory(cat)">{{ cat }}</a>
            </div>
            <div v-else class="text-xs text-slate-500 px-2 py-1">Đang tải danh mục…</div>
          </div>

          <a href="/phong-dau-gia" class="block py-2">Phòng đấu giá</a>
          <a href="#" class="block py-2">Kiến thức</a>
          <a href="#" class="block py-2">Tin tức</a>

          <!-- Tài khoản -->
          <template v-if="user">
            <button type="button" class="flex w-full items-center justify-between py-2 text-left" @click="mobileUserOpen = !mobileUserOpen" :aria-expanded="mobileUserOpen" aria-controls="mobile-user-menu">
              <span class="inline-flex items-center gap-2">
                <font-awesome-icon icon="user" class="text-xl m-0" />
                <span class="text-sm">{{ fullName || 'Tài khoản' }}</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" :class="mobileUserOpen ? 'rotate-180' : 'rotate-0'" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            <div id="mobile-user-menu" v-show="mobileUserOpen" class="pl-2 pb-2">
              <a href="#" class="block text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50" @click.prevent="goProfileMobile">Thông tin cá nhân</a>
              <button class="block w-full text-left text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50" @click="logoutMobile">Đăng xuất</button>
            </div>
          </template>
          <template v-else>
            <a class="block py-2" href="#" @click.prevent="goLogin">Đăng nhập</a>
            <a class="block py-2" href="#" @click.prevent="goLogin">Đăng ký</a>
          </template>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <div class="page">
        <!-- Toolbar -->
        <div class="toolbar">
      <div class="toolbar-left">
        <input
          v-model="q"
          type="search"
          class="input"
          placeholder="Tìm kiếm tài sản, mã tài sản…"
        />
        <select v-model="tab" class="select">
          <option value="upcoming">Sắp diễn ra</option>
          <option value="running">Đang diễn ra</option>
          <option value="ended">Đã kết thúc</option>
        </select>
        <select v-model="sortBy" class="select">
          <option value="latest">Mới nhất</option>
          <option value="soon">Sắp diễn ra</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>
      </div>
        </div>

        <div class="layout">
          <!-- Sidebar -->
          <aside class="sidebar">
        <h3 class="sidebar-title">Kết quả lọc hoạt động đấu giá</h3>

        <details open class="panel">
          <summary>Danh mục tài sản</summary>
          <div class="panel-body">
            <label v-for="c in categories" :key="c" class="check">
              <input type="checkbox" :value="c" v-model="selectedCategories" />
              <span>{{ c }}</span>
            </label>
          </div>
        </details>

        <details open class="panel">
          <summary>Khu vực theo tỉnh/thành</summary>
          <div class="panel-body" style="max-height: 180px; overflow: auto">
            <label v-for="r in regions" :key="r" class="check">
              <input type="checkbox" :value="r" v-model="selectedRegions" />
              <span>{{ r }}</span>
            </label>
          </div>
        </details>

        <details open class="panel">
          <summary>Mức giá</summary>
          <div class="panel-body">
            <select v-model="selectedPrice" class="select full">
              <option value="">Tất cả</option>
              <option v-for="p in priceTiers" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </details>
          </aside>

          <!-- Main content -->
          <main class="content">
            <!-- Active chips -->
            <div v-if="hasActiveFilters" class="chips">
              <span class="muted">Đang lọc:</span>
              <button v-for="c in selectedCategories" :key="'c-' + c" class="chip" @click="toggle(selectedCategories, c)">
                {{ c }} ×
              </button>
              <button v-for="r in selectedRegions" :key="'r-' + r" class="chip" @click="toggle(selectedRegions, r)">
                {{ r }} ×
              </button>
              <button v-if="selectedPrice" class="chip" @click="selectedPrice = ''">
                {{ selectedPrice }} ×
              </button>
              <button class="reset" @click="resetFilters">Xóa tất cả</button>
            </div>

            <!-- Grid -->
            <div class="grid">
              <article v-for="item in pagedItems" :key="item.id" class="card">
                <div class="card-top">
                  <span class="badge">Sắp diễn ra</span>
                  <span class="muted small">{{ item.region }}</span>
                </div>

                <div class="thumb">
                  <img :src="item.img" :alt="`QR ${item.id}`" />
                </div>

                <h3 class="title">{{ item.title }}</h3>
                <div class="meta">
                  <div>Mã tài sản: <b>{{ item.code }}</b></div>
                  <div>Thời gian: <b>{{ formatDate(item.startAt) }}</b></div>
                </div>

                <div class="price">
                  Giá khởi điểm:
                  <b class="on">{{ shortPrice(item.startPrice) }}</b>
                  <b class="off">{{ fullPrice(item.startPrice) }}</b>
                </div>

                <button class="btn" @click="registerItem(item)">Đăng ký đấu giá</button>
              </article>
            </div>

            <!-- Pagination dots -->
            <div class="dots">
              <button v-for="n in totalPages" :key="n" :class="['dot', { active: page === n }]" @click="page = n" :aria-label="`Trang ${n}`" />
            </div>
          </main>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">D</div>
            <span class="font-semibold">DauGiaLive.vn</span>
          </div>
          <p class="mt-3 text-sm text-slate-600">Nền tảng đấu giá trực tuyến: minh bạch, hiệu quả, đa dạng tài sản.</p>
          <div class="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6c0 5.25 6 10 6 10s6-4.75 6-10a6 6 0 00-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
            27 Trần Duy Hưng, Cầu Giấy, Hà Nội
          </div>
        </div>

        <div>
          <h4 class="font-semibold">Trong mục</h4>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#" class="hover:text-sky-600">Danh mục tài sản</a></li>
            <li><a href="#" class="hover:text-sky-600">Phương thức đấu giá</a></li>
            <li><a href="#" class="hover:text-sky-600">Tin tức</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold">Về chúng tôi</h4>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#" class="hover:text-sky-600">Giới thiệu</a></li>
            <li><a href="#" class="hover:text-sky-600">Liên hệ</a></li>
            <li><a href="#" class="hover:text-sky-600">Tuyển dụng</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold">Chính sách</h4>
          <ul class="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#" class="hover:text-sky-600">Điều khoản sử dụng</a></li>
            <li><a href="#" class="hover:text-sky-600">Bảo mật thông tin</a></li>
            <li><a href="#" class="hover:text-sky-600">Hướng dẫn thanh toán</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-200">
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-4 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <div>© {{ new Date().getFullYear() }} DauGiaLive.vn. All rights reserved.</div>
          <div class="mt-2 md:mt-0">Hỗ trợ: VISA • MasterCard • VNPay</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { useUserStore } from '../stores/userStore'
export default {
  name: 'PhongDauGia',
  data() {
    const categories = ['Bất động sản', 'Xe', 'Hàng hóa', 'Tài sản khác']
    const regions = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Bình Dương', 'Đồng Nai']
    const priceTiers = ['< 100 triệu', '100 triệu - 1 tỷ', '1 - 5 tỷ', '> 5 tỷ']

    const items = Array.from({ length: 24 }).map((_, i) => {
      const cat = categories[i % categories.length]
      const reg = regions[i % regions.length]
      const status = ['upcoming', 'running', 'ended'][i % 3]
      const startPrice = [60_000_000, 250_000_000, 1_200_000_000, 6_000_000_000][i % 4]
      const id = `TS-${8700 + i}`
      return {
        id,
        title: `Thông báo đấu giá tài sản số ${8700 + i}/23/TS`,
        category: cat,
        region: reg,
        status,
        startAt: new Date(Date.now() + (i % 7) * 86400000).toISOString(),
        startPrice,
        code: `BĐS${1000 + i}`,
        img: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(id)}`
      }
    })

    return {
      q: '',
      tab: 'upcoming',
      sortBy: 'latest',
      categories,
      regions,
      priceTiers,
      selectedCategories: [],
      selectedRegions: [],
      selectedPrice: '',
      items,
      page: 1,
      pageSize: 9,
      // Header state
      mobileOpen: false,
      mobileCatsOpen: false,
      mobileUserOpen: false,
      userStore: null
    }
  },
  computed: {
    user() {
      return this.userStore ? this.userStore.user : null
    },
    fullName() {
      if (!this.user) return ''
      return `${this.user.ho} ${this.user.tenlot} ${this.user.ten}`.trim()
    },
    hasActiveFilters() {
      return (
        this.selectedCategories.length ||
        this.selectedRegions.length ||
        this.selectedPrice
      )
    },
    filtered() {
      let data = this.items.slice()

      // tab
      data = data.filter(i => i.status === this.tab)

      // search
      const t = this.q.trim().toLowerCase()
      if (t) {
        data = data.filter(
          i =>
            i.title.toLowerCase().includes(t) ||
            i.code.toLowerCase().includes(t) ||
            i.id.toLowerCase().includes(t)
        )
      }

      // categories
      if (this.selectedCategories.length) {
        data = data.filter(i => this.selectedCategories.includes(i.category))
      }
      // regions
      if (this.selectedRegions.length) {
        data = data.filter(i => this.selectedRegions.includes(i.region))
      }
      // price
      if (this.selectedPrice) {
        data = data.filter(i => this.priceTierOf(i.startPrice) === this.selectedPrice)
      }

      // sort
      if (this.sortBy === 'latest') {
        data.sort((a, b) => b.id.localeCompare(a.id))
      } else if (this.sortBy === 'soon') {
        data.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
      } else if (this.sortBy === 'priceAsc') {
        data.sort((a, b) => a.startPrice - b.startPrice)
      } else if (this.sortBy === 'priceDesc') {
        data.sort((a, b) => b.startPrice - a.startPrice)
      }

      return data
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filtered.length / this.pageSize))
    },
    pagedItems() {
      if (this.page > this.totalPages) this.page = 1
      const start = (this.page - 1) * this.pageSize
      return this.filtered.slice(start, start + this.pageSize)
    }
  },
  created() {
    // init store for header user state
    this.userStore = useUserStore()
  },
  methods: {
    // Header actions
    goLogin() {
      this.$router.push({ name: 'Login' })
    },
    goProfile() {
      this.$router.push({ name: 'Profile' })
    },
    logout() {
      if (this.userStore) this.userStore.logout()
      Cookies.remove('jwt_token')
      this.$router.push({ name: 'Login' })
    },
    goSearchCategory(cat) {
      this.$router.push({ name: 'SearchResults', query: { q: '', category: cat } })
    },
    selectMobileCategory(cat) {
      this.mobileCatsOpen = false
      this.mobileOpen = false
      this.goSearchCategory(cat)
    },
    goProfileMobile() {
      this.mobileUserOpen = false
      this.mobileOpen = false
      this.goProfile()
    },
    logoutMobile() {
      this.mobileUserOpen = false
      this.mobileOpen = false
      this.logout()
    },
    toggle(arr, val) {
      const i = arr.indexOf(val)
      if (i === -1) arr.push(val)
      else arr.splice(i, 1)
    },
    resetFilters() {
      this.selectedCategories = []
      this.selectedRegions = []
      this.selectedPrice = ''
    },
    priceTierOf(v) {
      if (v < 100_000_000) return '< 100 triệu'
      if (v >= 100_000_000 && v < 1_000_000_000) return '100 triệu - 1 tỷ'
      if (v >= 1_000_000_000 && v <= 5_000_000_000) return '1 - 5 tỷ'
      return '> 5 tỷ'
    },
    shortPrice(v) {
      if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1).replace('.0','') + ' tỷ'
      if (v >= 1_000_000) return Math.round(v / 1_000_000) + ' triệu'
      return new Intl.NumberFormat('vi-VN').format(v) + ' đ'
    },
    fullPrice(v) {
      return new Intl.NumberFormat('vi-VN').format(v) + ' đ'
    },
    formatDate(iso) {
      const d = new Date(iso)
      return d.toLocaleString('vi-VN', { hour12: false })
    },
    registerItem(item) {
      alert(`Bạn đã chọn "Đăng ký đấu giá" cho tài sản ${item.id}`)
    }
  }
}
</script>

<style scoped>
.page {
  padding: 16px;
}
.toolbar {
  position: sticky;
  /* push below sticky header height (h-16 = 64px) */
  top: 64px;
  z-index: 5;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 12px;
}
.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.input {
  min-width: 260px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}
.select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}
.select.full {
  width: 100%;
}
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
.sidebar-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.panel {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 10px;
  padding: 8px 12px;
}
.panel > summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}
.panel-body {
  margin-top: 8px;
  display: grid;
  gap: 6px;
}
.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.content {
  min-height: 400px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}
.chip {
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.reset {
  background: transparent;
  color: #06b6d4;
  border: none;
  cursor: pointer;
  font-size: 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
}
.card {
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(2, 32, 71, 0.06);
}
.card-top {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
}
.badge {
  display: inline-block;
  background: #fde68a;
  color: #92400e;
  padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 600;
}
.muted { color: #6b7280; }
.small { font-size: 12px; }
.thumb {
  border: 1px solid #f3f4f6;
  background: #fafafa;
  border-radius: 10px;
  aspect-ratio: 1 / 1;
  display: grid; place-items: center;
  overflow: hidden;
  margin: 10px 0;
}
.thumb img { width: 100%; height: 100%; object-fit: contain; }
.title { font-weight: 600; line-height: 1.3; margin: 6px 0; min-height: 40px; }
.meta { font-size: 14px; color: #4b5563; display: grid; gap: 2px; }
.price { font-size: 14px; color: #4b5563; margin-top: 6px; }
.price .off { display: none; }
.price:hover .on { display: none; }
.price:hover .off { display: inline; }
.btn {
  width: 100%;
  margin-top: 10px;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #22b8cf;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.btn:hover { background: #1098ad; }
.dots {
  display: flex; justify-content: center; gap: 6px; padding: 14px 0;
}
.dot {
  width: 10px; height: 10px; border-radius: 999px; background: #d1d5db; border: none; cursor: pointer;
}
.dot.active { width: 24px; background: #22b8cf; }
</style>
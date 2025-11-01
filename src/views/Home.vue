<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div
        class="max-w-[1200px] mx-auto px-4 lg:px-6 flex items-center justify-between h-16"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold"
          >
            D
          </div>
          <span class="font-semibold">DauGiaLive.vn</span>
        </div>

        <!-- NAV with hover dropdown for categories (desktop giữ nguyên) -->
        <nav class="hidden lg:flex items-center gap-8 text-sm">
          <!-- Danh mục tài sản + dropdown -->
          <div class="relative group">
            <a
              href="#"
              class="hover:text-sky-600 inline-flex items-center gap-1"
              @click.prevent
              tabindex="0"
            >
              Danh mục tài sản
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
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

            <!-- Dropdown desktop -->
            <div
              class="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-0 top-full w-50 bg-white border border-slate-200 shadow-xl rounded-xl z-50"
            >
              <div class="p-2 max-h-72 overflow-auto">
                <template v-if="categories.length">
                  <a
                    v-for="cat in categories"
                    :key="cat"
                    href="#"
                    class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                    @click.prevent="
                      router.push({
                        name: 'SearchResults',
                        query: { q: '', category: cat },
                      })
                    "
                  >
                    {{ cat }}
                  </a>
                </template>
                <div v-else class="px-3 py-2 text-sm text-slate-500">
                  Đang tải danh mục…
                </div>
              </div>
            </div>
          </div>

          <a href="/phong-dau-gia" class="hover:text-sky-600">Phòng đấu giá</a>
          <a href="#" class="hover:text-sky-600">Kiến thức</a>
          <a href="#" class="hover:text-sky-600">Tin tức</a>
        </nav>

        <!-- User section desktop: thêm dropdown như danh mục -->
        <div class="hidden lg:flex items-center gap-4">
          <template v-if="user">
            <div class="relative group">
              <button
                type="button"
                class="inline-flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-50"
              >
                <font-awesome-icon icon="user" class="text-xl" />
                <span class="text-sm">{{ fullName || "Tài khoản" }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
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
                class="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute right-0 top-full w-56 bg-white border border-slate-200 shadow-xl rounded-xl z-50"
              >
                <div class="p-2">
                  <a
                    href="#"
                    class="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                    @click.prevent="goProfile"
                  >
                    Thông tin cá nhân
                  </a>
                  <button
                    class="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                    @click="logout"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </template>
          <button v-else @click="goLogin" class="text-sm hover:text-sky-600">
            Đăng nhập
          </button>
        </div>

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

      <!-- Mobile menu (đã thêm dropdown có thể mở/đóng cho Danh mục và Tài khoản) -->
      <div v-if="mobileOpen" class="lg:hidden border-t border-slate-100">
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-3 space-y-1">
          <!-- Danh mục -->
          <button
            type="button"
            class="flex w-full items-center justify-between py-2 text-left"
            @click="mobileCatsOpen = !mobileCatsOpen"
            :aria-expanded="mobileCatsOpen"
            aria-controls="mobile-categories"
          >
            <span>Danh mục tài sản</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform duration-200"
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
          <div id="mobile-categories" v-show="mobileCatsOpen" class="pl-2 pb-2">
            <div v-if="categories.length" class="grid grid-cols-2 gap-2">
              <a
                v-for="cat in categories"
                :key="`m-${cat}`"
                href="#"
                class="block text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
                @click.prevent="
                  mobileCatsOpen = false;
                  mobileOpen = false;
                  router.push({ name: 'SearchResults', query: { q: '', category: cat } });
                "
              >
                {{ cat }}
              </a>
            </div>
            <div v-else class="text-xs text-slate-500 px-2 py-1">Đang tải danh mục…</div>
          </div>

          <a href="/phong-dau-gia" class="block py-2">Phòng đấu giá</a>
          <a href="#" class="block py-2">Kiến thức</a>
          <a href="#" class="block py-2">Tin tức</a>

          <!-- Tài khoản -->
          <template v-if="user">
            <button
              type="button"
              class="flex w-full items-center justify-between py-2 text-left"
              @click="mobileUserOpen = !mobileUserOpen"
              :aria-expanded="mobileUserOpen"
              aria-controls="mobile-user-menu"
            >
              <span class="inline-flex items-center gap-2">
                <font-awesome-icon icon="user" class="text-xl m-0" />
                <span class="text-sm">{{ fullName || "Tài khoản" }}</span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-200"
                :class="mobileUserOpen ? 'rotate-180' : 'rotate-0'"
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
            <div id="mobile-user-menu" v-show="mobileUserOpen" class="pl-2 pb-2">
              <a
                href="#"
                class="block text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
                @click.prevent="
                  mobileUserOpen = false;
                  mobileOpen = false;
                  goProfile();
                "
              >
                Thông tin cá nhân
              </a>
              <button
                class="block w-full text-left text-sm text-slate-700 px-2 py-1 rounded hover:bg-slate-50"
                @click="
                  mobileUserOpen = false;
                  mobileOpen = false;
                  logout();
                "
              >
                Đăng xuất
              </button>
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
      <!-- Banner chính + popup video -->
      <section class="relative overflow-hidden">
        <div
          class="relative bg-[url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop')] bg-center bg-cover"
        >
          <div class="bg-white/60">
            <div
              class="max-w-[1200px] mx-auto px-4 lg:px-6 pt-12 pb-28 lg:pt-16 lg:pb-40"
            >
              <div class="max-w-3xl">
                <h1 class="text-3xl lg:text-5xl font-extrabold leading-tight">
                  SÀN ĐẤU GIÁ TRỰC TUYẾN
                </h1>
                <p class="mt-4 text-slate-700 text-lg">
                  Đăng tin - Đăng ký đấu giá - Thanh toán, tất cả trong một nền tảng minh
                  bạch.
                </p>
                <div class="mt-6 flex items-center gap-3">
                  <a
                    href="#"
                    class="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-lg"
                    >Bắt đầu ngay</a
                  >
                  <button
                    @click="videoOpen = true"
                    class="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-sky-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M6.3 5.3a1 1 0 0 0-1.6.8v7.8a1 1 0 0 0 1.6.8l7-3.9a1 1 0 0 0 0-1.7l-7-3.8Z"
                      />
                    </svg>
                    Xem video hướng dẫn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Video -->
        <div
          v-if="videoOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          @keydown.esc="closeVideo"
        >
          <div
            class="w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-xl relative"
          >
            <button
              @click="closeVideo"
              class="absolute -top-3 -right-3 bg-white text-slate-700 rounded-full h-8 w-8 shadow flex items-center justify-center"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div class="aspect-video">
              <iframe
                class="w-full h-full"
                :src="videoSrc"
                title="Hướng dẫn sử dụng"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <!-- Danh mục tài sản -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <h2 class="text-center text-2xl lg:text-3xl font-bold mb-8">DANH MỤC TÀI SẢN</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="c in categoryCards"
            :key="c.id"
            class="group rounded-xl border border-slate-200 bg-white p-5 text-left hover:shadow-[0_10px_30px_rgba(2,48,71,0.08)] transition"
          >
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xl"
              >
                <span aria-hidden="true">{{ c.emoji }}</span>
              </div>
              <div>
                <div class="font-semibold group-hover:text-sky-600">{{ c.name }}</div>
                <div class="text-sm text-slate-500">
                  {{ formatNumber(c.count) }} tin đăng
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      <!-- Tài sản sắp đấu giá / Đấu giá thành công -->
      <section class="bg-slate-50 py-10 lg:py-14">
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">TÀI SẢN SẮP ĐẤU GIÁ</h3>
                <a href="#" class="text-sm text-sky-600 hover:underline">Xem tất cả →</a>
              </div>
              <div class="space-y-4">
                <article
                  v-for="it in upcomingAuctions"
                  :key="it.id"
                  class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-[0_10px_30px_rgba(2,48,71,0.08)] transition"
                >
                  <div class="flex gap-4">
                    <div
                      class="w-28 h-28 rounded-lg bg-slate-100 flex-none overflow-hidden"
                    >
                      <img
                        v-if="it.image"
                        :src="it.image"
                        class="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="inline-flex text-xs items-center rounded-full px-2 py-0.5 bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        >
                          Sắp đấu giá
                        </span>
                      </div>
                      <h3 class="font-semibold leading-snug clamp-2">
                        {{ it.title }}
                      </h3>
                      <p class="text-sm text-slate-600 mt-1 clamp-2">{{ it.excerpt }}</p>
                      <div class="mt-3 flex items-center justify-between">
                        <div>
                          <div class="text-sm text-slate-500">{{ it.time }}</div>
                          <div class="text-sm font-semibold text-sky-600 mt-0.5">
                            Giá khởi điểm: {{ it.priceStart }} đ
                          </div>
                        </div>
                        <a
                          href="#"
                          class="inline-flex items-center bg-sky-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-sky-600"
                        >
                          {{ it.cta || "ĐĂNG KÝ ĐẤU GIÁ" }}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">ĐẤU GIÁ THÀNH CÔNG</h3>
                <a href="#" class="text-sm text-sky-600 hover:underline">Xem tất cả →</a>
              </div>
              <div class="space-y-4">
                <article
                  v-for="it in completedAuctions"
                  :key="it.id"
                  class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-[0_10px_30px_rgba(2,48,71,0.08)] transition"
                >
                  <div class="flex gap-4">
                    <div
                      class="w-28 h-28 rounded-lg bg-slate-100 flex-none overflow-hidden"
                    >
                      <img
                        v-if="it.image"
                        :src="it.image"
                        class="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="inline-flex text-xs items-center rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        >
                          Thành công
                        </span>
                      </div>
                      <h3 class="font-semibold leading-snug clamp-2">
                        {{ it.title }}
                      </h3>
                      <p class="text-sm text-slate-600 mt-1 clamp-2">{{ it.excerpt }}</p>
                      <div class="mt-3 flex items-center justify-between">
                        <div>
                          <div class="text-sm text-slate-500">{{ it.time }}</div>
                          <div class="text-sm font-semibold text-emerald-700 mt-0.5">
                            {{ it.priceStart }}
                          </div>
                        </div>
                        <span
                          class="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1"
                        >
                          Đấu giá thành công
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Lợi ích nổi bật -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <h2 class="text-center text-2xl lg:text-3xl font-bold mb-10">
          LỢI ÍCH VƯỢT TRỘI KHI CHỌN DAUGIALIVE.VN
        </h2>
        <div class="grid lg:grid-cols-3 gap-8 items-start">
          <!-- Bên bán -->
          <ul class="space-y-5">
            <li v-for="b in sellerBenefits" :key="b.title" class="flex items-start gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 text-lg"
              >
                {{ b.emoji }}
              </div>
              <div>
                <div class="font-semibold">{{ b.title }}</div>
                <div class="text-sm text-slate-600">{{ b.desc }}</div>
              </div>
            </li>
          </ul>

          <!-- Illustration -->
          <div class="hidden lg:flex items-center justify-center">
            <img
              alt="illustration"
              class="w-full max-w-xs"
              src="https://images.unsplash.com/illustration-technology.jpg?auto=format&fit=crop&w=600&q=60"
              onerror="this.style.display='none'"
            />
          </div>

          <!-- Bên mua -->
          <ul class="space-y-5">
            <li v-for="b in buyerBenefits" :key="b.title" class="flex items-start gap-3">
              <div
                class="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg"
              >
                {{ b.emoji }}
              </div>
              <div>
                <div class="font-semibold">{{ b.title }}</div>
                <div class="text-sm text-slate-600">{{ b.desc }}</div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Liên hệ -->
      <section
        class="relative py-12 lg:py-16 bg-gradient-to-br from-sky-500 to-sky-600 text-white"
      >
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div class="grid lg:grid-cols-2 gap-10 items-center">
            <div class="space-y-2">
              <h3 class="text-2xl font-bold">LIÊN HỆ VỚI CHÚNG TÔI</h3>
              <p class="text-white/80">
                Hỗ trợ 24/7: tư vấn đăng tin, đăng ký đấu giá, pháp lý…
              </p>
              <ul class="mt-4 space-y-2 text-white/90">
                <li class="flex items-center gap-2">📞 Hotline: 0961.592.468</li>
                <li class="flex items-center gap-2">✉️ Email: cskh.daugia@gmail.com</li>
                <li class="flex items-center gap-2">
                  📍 Tòa nhà Eurowindow, 27 Trần Duy Hưng, Cầu Giấy, Hà Nội
                </li>
              </ul>
            </div>

            <form
              class="bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(2,48,71,0.12)]"
              @submit.prevent="onSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium">Họ và tên</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="mt-1 input"
                    placeholder="Nguyễn Văn A"
                  />
                  <p v-if="errors.name" class="text-xs text-red-600 mt-1">
                    {{ errors.name }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium">Số điện thoại</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="mt-1 input"
                    placeholder="09xx xxx xxx"
                  />
                  <p v-if="errors.phone" class="text-xs text-red-600 mt-1">
                    {{ errors.phone }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="mt-1 input"
                    placeholder="email@domain.com"
                  />
                  <p v-if="errors.email" class="text-xs text-red-600 mt-1">
                    {{ errors.email }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="text-sm font-medium">Lời nhắn</label>
                  <textarea
                    v-model="form.message"
                    rows="4"
                    class="mt-1 input"
                    placeholder="Nội dung cần hỗ trợ..."
                  ></textarea>
                  <p v-if="errors.message" class="text-xs text-red-600 mt-1">
                    {{ errors.message }}
                  </p>
                </div>
                <div class="md:col-span-2 flex items-center gap-2">
                  <input
                    id="agree"
                    type="checkbox"
                    v-model="form.agree"
                    class="rounded border-slate-300"
                  />
                  <label for="agree" class="text-sm text-slate-700"
                    >Tôi đồng ý với Chính sách bảo mật</label
                  >
                </div>
              </div>
              <button
                type="submit"
                class="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-medium"
              >
                LIÊN HỆ NGAY
              </button>
              <p
                v-if="success"
                class="mt-3 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2 text-sm"
              >
                Gửi thông tin thành công! Chúng tôi sẽ liên hệ sớm nhất.
              </p>
            </form>
          </div>
        </div>
      </section>

      <!-- Tin tức -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <h2 class="text-center text-2xl lg:text-3xl font-bold mb-8">TIN TỨC</h2>
        <div class="grid lg:grid-cols-2 gap-6">
          <article
            v-for="p in news"
            :key="p.id"
            class="rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-[0_10px_30px_rgba(2,48,71,0.08)] transition"
          >
            <div class="grid grid-cols-3 gap-0">
              <div class="col-span-1 h-36 bg-slate-100">
                <img :src="p.image" alt="" class="w-full h-full object-cover" />
              </div>
              <div class="col-span-2 p-4">
                <div class="text-xs text-slate-500">{{ p.date }}</div>
                <h3 class="font-semibold mt-1 clamp-2">{{ p.title }}</h3>
                <p class="text-sm text-slate-600 mt-1 clamp-2">{{ p.excerpt }}</p>
                <a href="#" class="inline-block mt-3 text-sky-600 text-sm hover:underline"
                  >Xem chi tiết →</a
                >
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Đối tác -->
      <section class="max-w-[1200px] mx-auto px-4 lg:px-6 pb-12">
        <h3 class="text-center text-xl font-semibold mb-6">ĐỐI TÁC CỦA CHÚNG TÔI</h3>
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          <img
            v-for="p in partners"
            :key="p.id"
            :src="p.logo"
            :alt="p.name"
            class="h-8 object-contain grayscale hover:grayscale-0 transition"
          />
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white">
      <div
        class="max-w-[1200px] mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <div>
          <div class="flex items-center gap-2">
            <div
              class="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold"
            >
              D
            </div>
            <span class="font-semibold">DauGiaLive.vn</span>
          </div>
          <p class="mt-3 text-sm text-slate-600">
            Nền tảng đấu giá trực tuyến: minh bạch, hiệu quả, đa dạng tài sản.
          </p>
          <div class="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10 2a6 6 0 00-6 6c0 5.25 6 10 6 10s6-4.75 6-10a6 6 0 00-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z"
              />
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
        <div
          class="max-w-[1200px] mx-auto px-4 lg:px-6 py-4 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between"
        >
          <div>© {{ new Date().getFullYear() }} DauGiaLive.vn. All rights reserved.</div>
          <div class="mt-2 md:mt-0">Hỗ trợ: VISA • MasterCard • VNPay</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import Cookies from "js-cookie";
// eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* Router + Store */
const router = useRouter();
const userStore = useUserStore();

/* Auth state (cũ) */
const user = computed(() => userStore.user);
const selectedCategory = ref("");
const searchQuery = ref("");

/* Header state (mới) */
const mobileOpen = ref(false);
/* Mobile dropdown state */
const mobileCatsOpen = ref(false);
const mobileUserOpen = ref(false);
/* Tự đóng submenu khi đóng toàn bộ mobile menu */
watch(mobileOpen, (open) => {
  if (!open) {
    mobileCatsOpen.value = false;
    mobileUserOpen.value = false;
  }
});

/* Banner video state */
const videoOpen = ref(false);
const videoSrc = computed(() =>
  videoOpen.value
    ? "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1"
    : "about:blank"
);
const closeVideo = () => (videoOpen.value = false);

/* Danh mục dùng cho dropdown (API cũ) */
const categories = ref([]); // mảng string: tên danh mục

/* Danh mục hiển thị dạng grid (mới) */
const categoryCards = [
  { id: 1, name: "Nhà ở - Chung cư", count: 152, emoji: "🏠" },
  { id: 2, name: "Nhà xưởng - Văn phòng", count: 87, emoji: "🏢" },
  { id: 3, name: "Mặt bằng kinh doanh", count: 64, emoji: "🏬" },
  { id: 4, name: "Máy móc - Thiết bị sản xuất", count: 71, emoji: "⚙️" },
  { id: 5, name: "Cổ phần - Thương hiệu", count: 12, emoji: "📈" },
  { id: 6, name: "Ô tô - Tài thụ", count: 148, emoji: "🚚" },
];

/* Auctions */
const upcomingAuctions = [
  {
    id: "au-001",
    title: "Quyền sử dụng đất và tài sản gắn liền với đất tại Quận 9, TP.HCM",
    priceStart: "2.400.000.000",
    time: "Thời gian: 09:00 10/11/2025",
    excerpt:
      "Tài sản gồm thửa đất số 123, tờ bản đồ 45; diện tích 80m²; mục đích sử dụng đất ở đô thị...",
    image: "",
    cta: "ĐĂNG KÝ ĐẤU GIÁ",
  },
  {
    id: "au-002",
    title: "Xe ô tô KIA Rondo 2019 - Biển số 51H-123.45",
    priceStart: "245.000.000",
    time: "Thời gian: 14:00 12/11/2025",
    excerpt:
      "Tình trạng hoạt động bình thường, ODO ~62.000km, một chủ sử dụng, bảo dưỡng định kỳ...",
    image: "",
  },
  {
    id: "au-003",
    title: "Tài sản thanh lý: máy CNC 5 trục - Model 2022",
    priceStart: "1.150.000.000",
    time: "Thời gian: 09:00 15/11/2025",
    excerpt:
      "Máy vận hành tốt, kèm phụ kiện; đã kiểm định an toàn; giao nhận tại KCN VSIP...",
    image: "",
  },
];

const completedAuctions = [
  {
    id: "ok-001",
    title: "TSĐB xử lý nợ: lô container hàng nội thất, 08 container",
    priceStart: "Đã bán: 3.120.000.000",
    time: "Kết thúc: 16:30 02/10/2025",
    excerpt: "Đấu giá thành công",
    image: "",
  },
  {
    id: "ok-002",
    title: "Tài sản thi hành án: căn hộ 2PN Q.7",
    priceStart: "Đã bán: 2.050.000.000",
    time: "Kết thúc: 10:00 26/09/2025",
    excerpt: "Đấu giá thành công",
    image: "",
  },
];

/* Lợi ích */
const features = ref([
  {
    icon: "bolt",
    title: "Đấu giá nhanh chóng",
    desc: "Tham gia dễ dàng chỉ với vài cú click.",
  },
  { icon: "gem", title: "Sản phẩm giá trị", desc: "Đa dạng mặt hàng chất lượng cao." },
  {
    icon: "bell",
    title: "Thông báo tức thời",
    desc: "Không bỏ lỡ bất kỳ phiên đấu giá nào.",
  },
]);
const sellerBenefits = [
  {
    emoji: "🌐",
    title: "Mở rộng mạng lưới kinh doanh",
    desc: "Tiếp cận người mua toàn quốc.",
  },
  { emoji: "⚡", title: "Thanh khoản nhanh", desc: "Nhiều hình thức đấu giá linh hoạt." },
  { emoji: "💡", title: "Tối ưu chi phí", desc: "Quy trình số hoá, giảm nhân sự." },
  { emoji: "🛡️", title: "Minh bạch", desc: "Tuân thủ pháp luật và bảo mật dữ liệu." },
];
const buyerBenefits = [
  { emoji: "🔍", title: "Tìm kiếm dễ", desc: "Bộ lọc đa tiêu chí, realtime." },
  { emoji: "🖱️", title: "Đặt giá mọi lúc", desc: "Trải nghiệm mượt trên mọi thiết bị." },
  { emoji: "🔔", title: "Nhắc giá", desc: "Thông báo push/email kịp thời." },
  { emoji: "⚖️", title: "Tương tác dễ", desc: "Hỏi đáp, đặt lịch xem, tư vấn." },
];

/* Tin tức + Đối tác */
const news = [
  {
    id: "n-1",
    title: "Thông báo đấu giá danh mục tài sản của Ngân hàng TMCP Quốc tế Việt Nam (VIB)",
    date: "11/06/2025",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&auto=format&fit=crop&q=60",
    excerpt:
      "Thông báo đấu giá danh mục tài sản đảm bảo, thuộc Ngân hàng TMCP Quốc tế Việt Nam (VIB)...",
  },
  {
    id: "n-2",
    title: "Cập nhật danh mục tài sản bán đấu giá hằng ngày",
    date: "28/05/2025",
    image:
      "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=640&auto=format&fit=crop&q=60",
    excerpt:
      "Danh mục tài sản bán đấu giá được cập nhật liên tục từ các đơn vị tổ chức đấu giá, ngân hàng...",
  },
  {
    id: "n-3",
    title: "Thông báo về đấu giá đối với tài sản vướng mắc pháp lý",
    date: "20/05/2025",
    image:
      "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=640&auto=format&fit=crop&q=60",
    excerpt:
      "Lưu ý về hồ sơ pháp lý đối với một số tài sản trước khi đăng ký tham gia đấu giá...",
  },
];

const partners = [
  {
    id: "p-1",
    name: "VPBank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/VPBank_logo.png",
  },
  {
    id: "p-2",
    name: "Sacombank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Sacombank_logo.png",
  },
  {
    id: "p-3",
    name: "Techcombank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Techcombank_logo.svg",
  },
  {
    id: "p-4",
    name: "VIB",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/VIB_Logo.png",
  },
  {
    id: "p-5",
    name: "SeABank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/SeABank_logo.svg",
  },
];

/* Form liên hệ */
const form = reactive({
  name: "",
  phone: "",
  email: "",
  message: "",
  agree: false,
});
const errors = reactive({ name: "", phone: "", email: "", message: "", agree: "" });
const success = ref(false);

function validate() {
  errors.name = form.name ? "" : "Vui lòng nhập họ tên";
  errors.phone = /^0\d{9,10}$/.test(form.phone || "") ? "" : "Số điện thoại không hợp lệ";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "")
    ? ""
    : "Email không hợp lệ";
  errors.message = form.message ? "" : "Vui lòng nhập nội dung";
  errors.agree = form.agree ? "" : "Bạn cần đồng ý chính sách";
  return (
    !errors.name && !errors.phone && !errors.email && !errors.message && !errors.agree
  );
}

function onSubmit() {
  if (!validate()) {
    success.value = false;
    return;
  }
  // TODO: gọi API backend để gửi liên hệ
  success.value = true;
  setTimeout(() => (success.value = false), 5000);
}

/* Helpers */
const fullName = computed(() => {
  if (!user.value) return "";
  return `${user.value.ho} ${user.value.tenlot} ${user.value.ten}`.trim();
});
const formatNumber = (n) => new Intl.NumberFormat("vi-VN").format(n);

/* API + điều hướng (cũ) */
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:8082/api/cates/find-all");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data.code === 200 && Array.isArray(data.result)) {
      categories.value = data.result.map((item) => item.tendm).filter(Boolean);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API danh mục:", error);
  }
}
onMounted(() => {
  loadCategories();
});
function handleSearch() {
  if (!searchQuery.value.trim()) return alert("Vui lòng nhập từ khóa!");
  router.push({
    name: "SearchResults",
    query: { q: searchQuery.value, category: selectedCategory.value },
  });
}
function goHome() {
  router.push({ name: "Home" });
}
function goLogin() {
  router.push({ name: "Login" });
}
function goProfile() {
  // Đổi 'Profile' thành route name đúng với dự án của bạn nếu khác
  router.push({ name: "Profile" });
}
function logout() {
  userStore.logout();
  Cookies.remove("jwt_token");
  router.push({ name: "Login" });
}
</script>

<style scoped></style>

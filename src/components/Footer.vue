<template>
  <!-- Footer -->
  <footer class="border-t border-slate-200 bg-slate-50">
    <div
      class="max-w-[1200px] mx-auto px-4 lg:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
    >
      <!-- Brand -->
      <div class="space-y-4">
        <div @click="goHome" class="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Logo" class="h-7 w-auto" />
        </div>

        <p class="text-sm text-slate-600 leading-relaxed">
          Sàn đấu giá trực tuyến an toàn, minh bạch và tiện lợi dành cho mọi người.
        </p>

        <p class="text-sm text-slate-600 leading-relaxed">
          180 Cao Lỗ, Quận 8, TP. Hồ Chí Minh, Việt Nam
        </p>

        <iframe
          class="w-full h-[140px]"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9615802554667!2d106.67510897591303!3d10.73744455990981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f62a90e5dbd%3A0x674d5126513db295!2sSaigon%20Technology%20University!5e0!3m2!1sen!2s!4v1767549934488!5m2!1sen!2s"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>

      <!-- Trang chủ -->
      <div>
        <h4 class="font-semibold text-slate-800 mb-4">Trang chủ</h4>
        <ul class="space-y-3 text-sm text-slate-600">
          <li>
            <a @click.prevent="goAuctionRoom" class="hover:text-sky-600 cursor-pointer"
              >Danh mục tài sản</a
            >
          </li>
          <li>
            <a @click.prevent="goAuctionRoom" class="hover:text-sky-600 cursor-pointer"
              >Phòng đấu giá</a
            >
          </li>
          <li><a href="#" class="hover:text-sky-600">Tin tức</a></li>
        </ul>
      </div>

      <!-- Về chúng tôi -->
      <div>
        <h4 class="font-semibold text-slate-800 mb-4">Về chúng tôi</h4>
        <ul class="space-y-3 text-sm text-slate-600">
          <li><a href="#" class="hover:text-sky-600">Giới thiệu</a></li>
          <li>
            <a href="mailto:daugiastu@gmail.com" class="hover:text-sky-600"> Liên hệ </a>
          </li>
          <li><a href="#" class="hover:text-sky-600">Tuyển dụng</a></li>
        </ul>
      </div>

      <!-- Chính sách -->
      <div>
        <h4 class="font-semibold text-slate-800 mb-4">Chính sách</h4>
        <ul class="space-y-3 text-sm text-slate-600">
          <li><a href="#" class="hover:text-sky-600">Điều khoản sử dụng</a></li>
          <li><a href="#" class="hover:text-sky-600">Bảo mật thông tin</a></li>
          <li><a href="#" class="hover:text-sky-600">Hướng dẫn thanh toán</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom -->
    <div class="border-t border-slate-200">
      <div
        class="max-w-[1200px] mx-auto px-4 lg:px-6 py-5 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-2"
      >
        <div>© {{ new Date().getFullYear() }} DauGiaSTU. All rights reserved.</div>
        <div>Hỗ trợ thanh toán: VNPay</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function goAuctionRoom() {
  router.push({ name: "AuctionRoom" });
}
</script>

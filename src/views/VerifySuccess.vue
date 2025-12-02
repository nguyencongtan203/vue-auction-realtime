<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 class="text-[22px] md:text-[26px] font-semibold text-green-600 mb-2">
      Xác thực email thành công!
    </h1>
    <p class="text-gray-600 mb-6">
      Tài khoản của bạn đã được xác thực.
    </p>
    <router-link
      to="/"
      class="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
    >
      Về trang chủ
    </router-link>
  </div>
</template>

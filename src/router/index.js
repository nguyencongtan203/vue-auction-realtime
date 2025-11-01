import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

// Import các trang
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import AuctionRoom from '../components/AuctionRoom.vue'
import PhongDauGia from '../views/PhongDauGia.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/phong-dau-gia',
    name: 'PhongDauGia',
    component: PhongDauGia
  },
  {
    path: '/auction',
    name: 'AuctionRoom',
    component: AuctionRoom,
    meta: { requiresAuth: true }, // 🔒 Cần đăng nhập
  },
  // Có thể thêm các route khác sau này
  {
    path: '/:pathMatch(.*)*',
    redirect: '/', // ⚙️ Redirect về Home nếu route không tồn tại
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Kiểm tra quyền truy cập trước mỗi điều hướng
router.beforeEach((to, from, next) => {
  const token = Cookies.get('jwt_token')

  // Nếu route yêu cầu đăng nhập mà chưa có token → quay về login
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
  }
  // Nếu đã đăng nhập mà vẫn cố vào trang login → đưa về home
  else if (to.name === 'Login' && token) {
    next({ name: 'Home' })
  }
  else {
    next()
  }
})

export default router

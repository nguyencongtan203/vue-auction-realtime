// stores/userStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNotificationStore } from './notificationStore'
import { useAuctionNotificationStore } from './useAuctionNotificationStore'
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: Cookies.get('jwt_token') || null,
    sse: null,
    loading: false,
  }),

  actions: {
    // 🔹 Gọi API lấy thông tin người dùng
    async fetchUser() {
      if (!this.token) return null
      try {
        this.loading = true
        const res = await axios.get('http://localhost:8082/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        if (res.data.code === 200) {
          this.user = res.data.result
          this.connectSSE()
          const auctionNotificationStore = useAuctionNotificationStore()
          await auctionNotificationStore.loadNotifications()
          return this.user
        } else {
          this.logout()
        }
      } catch (err) {
        console.error('❌ Lỗi khi fetch user:', err)
        this.logout()
      } finally {
        this.loading = false
      }
    },

    // 🔹 Khi login thành công
    setToken(token) {
      this.token = token
      Cookies.set('jwt_token', token, {
        expires: 7,        // lưu 7 ngày
        secure: false,     // đặt true nếu chạy https
        sameSite: 'Lax',
      })
    },

    // 🔹 Load lại user khi reload trang
    async loadUserFromCookies() {
      const token = Cookies.get('jwt_token')
      if (token && !this.user) {
        this.token = token
        await this.fetchUser()
      }
    },

    // 🔹 Kết nối SSE
    connectSSE() {
      if (!this.token) return
      const sseUrl = `http://localhost:8082/api/notifications/connect?token=${this.token}`
      const eventSource = new EventSource(sseUrl)
      const notificationStore = useNotificationStore()
      const auctionNotificationStore = useAuctionNotificationStore()
      eventSource.addEventListener('self-logout', (e) => { })

      eventSource.addEventListener('force-logout', (e) => {
        const msg = e.data || 'Tài khoản của bạn đã đăng nhập ở nơi khác!'
        notificationStore.show(msg, 'warning')
        setTimeout(() => {
          this.logout()
          window.location.href = '/login'
        }, 3000)
      })

      eventSource.addEventListener('banned', (e) => {
        const msg = e.data || 'Tài khoản của bạn đã bị khoá!'
        notificationStore.show(msg, 'warning')
        setTimeout(() => {
          this.logout()
          window.location.href = '/login'
        }, 3000)
      })

      eventSource.addEventListener('notification', (e) => {
      try {
        const notification = JSON.parse(e.data)
        auctionNotificationStore.addNotification(notification)
      } catch (error) {
        console.error('Lỗi parse notification SSE:', error)
      }
    })

      eventSource.onerror = () => {
        console.warn('⚠️ SSE connection closed')
      }

      this.sse = eventSource
      console.log('✅ SSE connected')
    },

    // 🔹 Đăng xuất
    logout() {
      this.user = null
      this.token = null
      Cookies.remove('jwt_token')
      if (this.sse) {
        this.sse.close()
        this.sse = null
      }
      const auctionNotificationStore = useAuctionNotificationStore()
      auctionNotificationStore.clear()
    },
  },
})

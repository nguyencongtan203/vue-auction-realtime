// stores/auctionNotificationStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'

export const useAuctionNotificationStore = defineStore('auctionNotification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),

  actions: {
    // Load notifications
async loadNotifications(page = 0, size = 10) {
    try {
      const token = Cookies.get('jwt_token')
      if (!token) return
      const res = await axios.get(`http://localhost:8082/api/notifications?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.code === 200) {
        // Append nếu load thêm, hoặc replace nếu page=0
        if (page === 0) this.notifications = res.data.result.content || []
        else this.notifications.push(...(res.data.result.content || []))
        this.updateUnreadCount()
        return res.data.result  // Trả về để check hasNext
      }
    } catch (error) {
      console.error('Lỗi load notifications:', error)
    }
  },

    // Add new notification từ SSE
    addNotification(notification) {
      this.notifications.unshift(notification) // Thêm vào đầu mảng
      if (this.notifications.length > 50) this.notifications.pop()
      this.updateUnreadCount()
    },

    // Mark as read
    async markAsRead(id) {
      try {
        const token = Cookies.get('jwt_token')
        await axios.patch(`http://localhost:8082/api/notifications/${id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const notif = this.notifications.find(n => n.matb === id)
        if (notif) notif.trangthai = 'VIEWED'
        this.updateUnreadCount()
      } catch (error) {
        console.error('Lỗi mark as read:', error)
      }
    },

    // Update unread count
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => n.trangthai !== 'VIEWED').length
    },

    // Clear all
    clear() {
      this.notifications = []
      this.unreadCount = 0
    },
  },
})
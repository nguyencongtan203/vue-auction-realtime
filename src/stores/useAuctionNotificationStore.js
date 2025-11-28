// stores/useAuctionNotificationStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import Cookies from 'js-cookie'

export const useAuctionNotificationStore = defineStore('auctionNotification', {
  state: () => ({
    notifications: [],
    totalUnread: 0,
  }),

  actions: {
    // Load notifications
    async loadNotifications(page = 0, size = 5) {
      try {
        const token = Cookies.get('jwt_token')
        if (!token) return
        const res = await axios.get(`http://localhost:8082/api/notifications?page=${page}&size=${size}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.code === 200) {
          if (page === 0) this.notifications = res.data.result.content || []
          else this.notifications.push(...(res.data.result.content || []))
          this.totalUnread = res.data.result.content[0]?.tongthongbaochuaxem || this.totalUnread
          return res.data.result
        }
      } catch (error) {
        console.error('Lỗi load notifications:', error)
      }
    },

    // Add new notification từ SSE
    addNotification(notification) {
      this.notifications.unshift(notification)
      if (this.notifications.length > 50) this.notifications.pop()
      if (notification.trangthai !== 'Đã xem') {
        this.totalUnread += 1
      }
    },

    // Dánh dấu đã đọc
    async markAsRead(id) {
      try {
        const token = Cookies.get('jwt_token')
        await axios.patch(`http://localhost:8082/api/notifications/${id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const notif = this.notifications.find(n => n.matb === id)
        if (notif) notif.trangthai = 'Đã xem'
        this.totalUnread = Math.max(0, this.totalUnread - 1)  // Giảm count
      } catch (error) {
        console.error('Lỗi mark as read:', error)
      }
    },

    // Đánh dấu tất cả đã đọc
    async markAllAsRead() {
      try {
        const token = Cookies.get('jwt_token')
        if (!token) return
        await axios.patch(`http://localhost:8082/api/notifications/mark-all-read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.notifications.forEach(n => n.trangthai = 'Đã xem')
        this.totalUnread = 0  // Reset
      } catch (error) {
        console.error('Lỗi mark all as read:', error)
      }
    },

    // Xóa tất cả thông báo
    async clearAll() {
      try {
        const token = Cookies.get('jwt_token')
        if (!token) return
        await axios.delete(`http://localhost:8082/api/notifications/clear-all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.clear()
      } catch (error) {
        console.error('Lỗi clear all notifications:', error)
      }
    },

    // Clear state
    clear() {
      this.notifications = []
      this.totalUnread = 0
    },
  },
})
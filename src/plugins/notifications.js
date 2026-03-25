import Vue from 'vue'
import NotificationContainer from '@/components/notification/index.vue'

let notificationInstance = null

export default {
  install(Vue) {
    // Создаем экземпляр компонента
    const div = document.createElement('div')
    document.body.appendChild(div)
    
    notificationInstance = new Vue({
      render: h => h(NotificationContainer)
    }).$mount(div)
    
    // Добавляем глобальный метод
    Vue.prototype.$notify = function(message, type, duration) {
      return notificationInstance.$children[0].addNotification(message, type, duration)
    }
    
    // Добавляем удобные методы для разных типов
    Vue.prototype.$notify.success = function(message, duration) {
      return notificationInstance.$children[0].addNotification(message, 'success', duration)
    }
    
    Vue.prototype.$notify.error = function(message, duration) {
      return notificationInstance.$children[0].addNotification(message, 'error', duration)
    }
    
    Vue.prototype.$notify.warning = function(message, duration) {
      return notificationInstance.$children[0].addNotification(message, 'warning', duration)
    }
    
    Vue.prototype.$notify.info = function(message, duration) {
      return notificationInstance.$children[0].addNotification(message, 'info', duration)
    }
  }
} 
import { createApp, ref } from 'vue'
import Toast, { type ToastProps } from '@/components/ui/Toast.vue'

interface ToastInstance {
  id: string
  app: any
  container: HTMLDivElement
}

class ToastManager {
  private toasts = ref<ToastInstance[]>([])
  private idCounter = 0

  show(options: Omit<ToastProps, 'onClose'>) {
    const id = `toast-${++this.idCounter}`
    
    // 创建容器
    const container = document.createElement('div')
    container.id = id
    
    // 创建Vue应用实例
    const app = createApp(Toast, {
      ...options,
      onClose: () => this.remove(id)
    })
    
    // 挂载到容器
    app.mount(container)
    
    // 添加到页面
    document.body.appendChild(container)
    
    // 记录实例
    const instance: ToastInstance = {
      id,
      app,
      container
    }
    
    this.toasts.value.push(instance)
    
    return id
  }

  remove(id: string) {
    const index = this.toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      const toast = this.toasts.value[index]
      
      // 延迟移除DOM，等待动画完成
      setTimeout(() => {
        if (toast.container.parentNode) {
          toast.container.parentNode.removeChild(toast.container)
        }
        toast.app.unmount()
      }, 300) // 与动画时长匹配
      
      this.toasts.value.splice(index, 1)
    }
  }

  success(message: string, duration = 3000) {
    return this.show({ message, type: 'success', duration })
  }

  error(message: string, duration = 5000) {
    return this.show({ message, type: 'error', duration })
  }

  info(message: string, duration = 3000) {
    return this.show({ message, type: 'info', duration })
  }

  warning(message: string, duration = 4000) {
    return this.show({ message, type: 'warning', duration })
  }

  clear() {
    this.toasts.value.forEach(toast => {
      this.remove(toast.id)
    })
  }
}

// 创建全局实例
const toastManager = new ToastManager()

// 导出composable
export function useToast() {
  return {
    toast: toastManager,
    success: toastManager.success.bind(toastManager),
    error: toastManager.error.bind(toastManager),
    info: toastManager.info.bind(toastManager),
    warning: toastManager.warning.bind(toastManager),
    clear: toastManager.clear.bind(toastManager)
  }
}

// 默认导出
export default toastManager

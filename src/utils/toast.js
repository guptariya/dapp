// Simple toast notification system
class ToastManager {
  constructor() {
    this.toasts = []
    this.listeners = []
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notify(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random()
    const toast = { id, message, type, duration }
    this.toasts.push(toast)
    this.listeners.forEach(listener => listener([...this.toasts]))

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.listeners.forEach(listener => listener([...this.toasts]))
  }

  success(message, duration) {
    return this.notify(message, 'success', duration)
  }

  error(message, duration) {
    return this.notify(message, 'error', duration)
  }

  info(message, duration) {
    return this.notify(message, 'info', duration)
  }

  warning(message, duration) {
    return this.notify(message, 'warning', duration)
  }
}

export const toast = new ToastManager()

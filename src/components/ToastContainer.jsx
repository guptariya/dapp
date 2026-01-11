import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'
import { toast } from '../utils/toast'

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts)
    return unsubscribe
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-200'
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-200'
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-200'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getStyles(toast.type)} border rounded-lg p-4 shadow-lg backdrop-blur-sm flex items-start gap-3 animate-slide-in`}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => toast.remove(toast.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer

import { useEffect } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'error' | 'success' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor =
    type === 'error'
      ? 'bg-red-500/20 border-red-500 text-red-400'
      : type === 'success'
        ? 'bg-green-500/20 border-green-500 text-green-400'
        : 'bg-blue-500/20 border-blue-500 text-blue-400'

  const Icon = type === 'error' ? AlertCircle : type === 'success' ? CheckCircle : AlertCircle

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
      <div
        className={`flex items-center gap-3 glass-strong rounded-lg p-4 border-2 ${bgColor} shadow-lg min-w-[300px] max-w-md`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}


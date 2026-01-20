import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'default' | 'warning' | 'danger' | 'success'
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'default', title, children }: CalloutProps) {
  const icons = {
    default: Info,
    warning: AlertTriangle,
    danger: XCircle,
    success: CheckCircle,
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'my-6 flex items-start rounded-md border p-4',
        {
          'border-blue-200 bg-blue-50 text-blue-900': type === 'default',
          'border-yellow-200 bg-yellow-50 text-yellow-900': type === 'warning',
          'border-red-200 bg-red-50 text-red-900': type === 'danger',
          'border-green-200 bg-green-50 text-green-900': type === 'success',
        }
      )}
    >
      <div className="select-none text-xl mr-3 pt-1">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm prose-p:my-0 prose-p:leading-normal">
          {children}
        </div>
      </div>
    </div>
  )
}

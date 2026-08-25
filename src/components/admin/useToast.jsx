import { useState, useCallback } from 'react'

// window.alert() の代わりに使う、アプリ内デザインのトースト通知。
// 使い方: const [notify, toastEl] = useToast(); notify('保存しました'); notify('エラーです', 'error')
export function useToast() {
  const [toast, setToast] = useState(null) // { message, type }

  const notify = useCallback((message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2600)
  }, [])

  const toastEl = toast ? (
    <div className={`toast show toast-${toast.type}`}>
      {toast.type === 'error' ? '⚠️ ' : '✅ '}{toast.message}
    </div>
  ) : null

  return [notify, toastEl]
}

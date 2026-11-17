import { useState, useCallback, useRef } from 'react'

const SHOW_MS = 2600
const UNDO_MS = 10000 // 「元に戻す」を押せる時間

// window.alert() の代わりに使う、アプリ内デザインのトースト通知。
// 使い方: const [notify, toastEl] = useToast(); notify('保存しました', 'success'); notify('エラーです')
// 取り消しできる操作は notify('削除しました', 'success', { undo: async () => {...} }) とすると「元に戻す」ボタンが出る
export function useToast() {
  const [toast, setToast] = useState(null) // { message, type, undo }
  const timer = useRef(null)

  const notify = useCallback((message, type = 'error', options = {}) => {
    clearTimeout(timer.current)
    setToast({ message, type, undo: options.undo })
    timer.current = setTimeout(() => setToast(null), options.undo ? UNDO_MS : SHOW_MS)
  }, [])

  async function runUndo() {
    const undo = toast.undo
    clearTimeout(timer.current)
    setToast(null)
    try {
      await undo()
      notify('元に戻しました', 'success')
    } catch (e) {
      console.error(e)
      notify(`元に戻せませんでした：${e.message}`)
    }
  }

  const toastEl = toast ? (
    <div className={`toast show toast-${toast.type} ${toast.undo ? 'toast-has-undo' : ''}`}>
      <span>{toast.type === 'error' ? '⚠️ ' : '✅ '}{toast.message}</span>
      {toast.undo && <button className="toast-undo" onClick={runUndo}>↩ 元に戻す</button>}
    </div>
  ) : null

  return [notify, toastEl]
}

import { useState, useCallback } from 'react'

// window.confirm() の代わりに使う、アプリ内デザインの確認モーダル。
// 使い方: const [confirm, confirmModal] = useConfirm(); const ok = await confirm('本当に削除しますか？')
export function useConfirm() {
  const [state, setState] = useState(null) // { message, danger, resolve }

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({ message, danger: options.danger !== false, resolve })
    })
  }, [])

  function handle(result) {
    state.resolve(result)
    setState(null)
  }

  const confirmModal = state ? (
    <div className="modal-backdrop" onClick={() => handle(false)}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <p style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{state.message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => handle(false)}>キャンセル</button>
          <button className={state.danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={() => handle(true)}>OK</button>
        </div>
      </div>
    </div>
  ) : null

  return [confirm, confirmModal]
}

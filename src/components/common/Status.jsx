import './status.css'

// 読み込み中・失敗時の表示を、子ども画面・管理画面で共通にする部品。
// 使い方: <LoadingView /> / <ErrorView onRetry={reload} />
export function LoadingView({ message = '読み込み中…' }) {
  return (
    <div className="status-view" role="status" aria-live="polite">
      <div className="status-icon status-bounce">📖</div>
      <p className="status-text">{message}</p>
    </div>
  )
}

export function ErrorView({ message = 'うまく開けなかったよ', hint = 'ネットにつながっているか確かめて、もう一度試してね', onRetry }) {
  return (
    <div className="status-view" role="alert">
      <div className="status-icon">⚠️</div>
      <p className="status-text">{message}</p>
      {hint && <p className="status-hint">{hint}</p>}
      {onRetry && <button className="status-retry" onClick={onRetry}>もう一度試す</button>}
    </div>
  )
}

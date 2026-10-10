import './status.css'

// 読み込み中・失敗時の表示を、子ども画面・管理画面で共通にする部品。
// 使い方: <LoadingView /> / <ErrorView onRetry={reload} />
export function LoadingView({ message = 'よみこみちゅう…' }) {
  return (
    <div className="status-view" role="status" aria-live="polite">
      <div className="status-icon status-bounce">📖</div>
      <p className="status-text">{message}</p>
    </div>
  )
}

export function ErrorView({ message = 'うまく ひらけなかったよ', hint = 'ネットに つながっているか たしかめて、もういちど ためしてね', onRetry }) {
  return (
    <div className="status-view" role="alert">
      <div className="status-icon">⚠️</div>
      <p className="status-text">{message}</p>
      {hint && <p className="status-hint">{hint}</p>}
      {onRetry && <button className="status-retry" onClick={onRetry}>もういちど ためす</button>}
    </div>
  )
}

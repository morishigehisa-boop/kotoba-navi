import { useRef, useCallback } from 'react'

// 日本語入力（IME）の変換中の「読み」を拾って、確定時に読み欄へ自動入力する。
// 注意：ブラウザやIMEによっては読みを取得できないことがあるため、
// 取得できた場合のみ自動入力し、できなければ手入力してもらう（既存入力は上書きしない）。
export function useImeReading(onReadingDetected) {
  const lastCompositionRef = useRef('')

  // 変換中（未確定）の文字列を覚えておく。ひらがなの読みがここに入る。
  const onCompositionUpdate = useCallback((e) => {
    const data = e.data || ''
    // ひらがな（と長音符）だけの状態＝変換前の読みとみなす
    if (/^[ぁ-んー]+$/.test(data)) {
      lastCompositionRef.current = data
    }
  }, [])

  // 確定したタイミングで、覚えておいた読みを通知する
  const onCompositionEnd = useCallback(() => {
    const reading = lastCompositionRef.current
    lastCompositionRef.current = ''
    if (reading) onReadingDetected(reading)
  }, [onReadingDetected])

  return { onCompositionUpdate, onCompositionEnd }
}

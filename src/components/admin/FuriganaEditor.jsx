import { useRef, useState } from 'react'
import { addFuriganaEntry, updateFuriganaEntry, deleteFuriganaEntry } from '../../lib/api'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'
import { useImeReading } from './useImeReading'

// ふりがな辞書の部品（ふりがな辞書タブ・プレビュータブで共通）
// onChanged(message)：追加・更新・削除のあと、親が再読み込みしてお知らせを出す

// 登録済みの単語の表（その場で編集・削除できる）
export function FuriganaTable({ entries, onChanged, emptyText }) {
  const [editingId, setEditingId] = useState(null)
  const [word, setWord] = useState('')
  const [reading, setReading] = useState('')
  const [confirm, confirmModal] = useConfirm()

  function startEdit(e) {
    setEditingId(e.id); setWord(e.word); setReading(e.reading)
  }

  async function save() {
    if (!word.trim() || !reading.trim()) return
    await updateFuriganaEntry(editingId, { word: word.trim(), reading: reading.trim() })
    setEditingId(null)
    await onChanged('ふりがなを更新しました')
  }

  async function remove(e) {
    if (!(await confirm(`「${e.word}（${e.reading}）」を削除しますか？`))) return
    await deleteFuriganaEntry(e.id)
    await onChanged('ふりがなを削除しました')
  }

  return (
    <>
      <table className="responsive-table furigana-table">
        <thead><tr><th>単語</th><th>読み</th><th></th></tr></thead>
        <tbody>
          {entries.length === 0 && emptyText && <tr><td colSpan="3" className="empty">{emptyText}</td></tr>}
          {entries.map((e) => (
            <tr key={e.id}>
              {editingId === e.id ? (
                <>
                  <td><input type="text" value={word} onChange={(ev) => setWord(ev.target.value)} /></td>
                  <td><input type="text" value={reading} onChange={(ev) => setReading(ev.target.value)} /></td>
                  <td className="row-actions">
                    <button className="btn btn-primary" onClick={save}>保存</button>
                    <button className="btn btn-secondary" onClick={() => setEditingId(null)}>キャンセル</button>
                  </td>
                </>
              ) : (
                <>
                  <td><b>{e.word}</b></td>
                  <td>{e.reading}</td>
                  <td className="row-actions">
                    <button className="btn btn-secondary" onClick={() => startEdit(e)}>編集</button>
                    <button className="btn btn-danger" onClick={() => remove(e)}>削除</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {confirmModal}
    </>
  )
}

// 新しい単語を登録する入力欄。漢字を変換確定したとき、その読みを自動で「読み」欄に入れる
export function FuriganaAddForm({ onChanged, wordPlaceholder = '単語', readingPlaceholder = '読み（ひらがな）', buttonLabel = '追加する', children }) {
  const [word, setWord] = useState('')
  const [reading, setReading] = useState('')
  const [saving, setSaving] = useState(false)
  const wordRef = useRef(null)
  const ime = useImeReading((r) => setReading((prev) => prev || r)) // すでに入力済みなら上書きしない
  const [notify, toastEl] = useToast()

  async function add() {
    if (!word.trim() || !reading.trim()) { notify('単語と読みの両方を入力してください'); return }
    setSaving(true)
    try {
      await addFuriganaEntry(word.trim(), reading.trim())
      setWord(''); setReading('')
      await onChanged('ふりがなを追加しました')
    } catch {
      notify('追加に失敗しました（同じ単語が既に登録されている可能性があります）')
    } finally {
      setSaving(false)
      wordRef.current?.focus()
    }
  }

  return (
    <div className="filters" style={children ? undefined : { marginBottom: 0 }}>
      <input ref={wordRef} type="text" placeholder={wordPlaceholder} style={{ width: 140 }} value={word} onChange={(e) => setWord(e.target.value)} onCompositionUpdate={ime.onCompositionUpdate} onCompositionEnd={ime.onCompositionEnd} />
      <input type="text" placeholder={readingPlaceholder} style={{ width: 140 }} value={reading} onChange={(e) => setReading(e.target.value)} />
      <button className="btn btn-primary" disabled={saving} onClick={add}>{buttonLabel}</button>
      {children}
      {toastEl}
    </div>
  )
}

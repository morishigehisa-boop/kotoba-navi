import { useRef, useState } from 'react'
import { addFuriganaEntry, updateFuriganaEntry, deleteFuriganaEntry } from '../../lib/api'

export default function FuriganaPanel({ entries, onChanged }) {
  const [word, setWord] = useState('')
  const [reading, setReading] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editWord, setEditWord] = useState('')
  const [editReading, setEditReading] = useState('')
  const [saving, setSaving] = useState(false)
  const wordInputRef = useRef(null)

  const filtered = entries.filter((e) => !search || e.word.includes(search) || e.reading.includes(search))

  async function handleAdd() {
    if (!word.trim() || !reading.trim()) { window.alert('単語と読みの両方を入力してください'); return }
    setSaving(true)
    try {
      await addFuriganaEntry(word.trim(), reading.trim())
      setWord(''); setReading('')
      await onChanged('ふりがなを追加しました')
    } catch (e) {
      window.alert('追加に失敗しました（同じ単語が既に登録されている可能性があります）')
    } finally {
      setSaving(false)
      wordInputRef.current?.focus()
    }
  }

  function startEdit(e) {
    setEditingId(e.id); setEditWord(e.word); setEditReading(e.reading)
  }

  async function saveEdit() {
    if (!editWord.trim() || !editReading.trim()) return
    await updateFuriganaEntry(editingId, { word: editWord.trim(), reading: editReading.trim() })
    setEditingId(null)
    await onChanged('ふりがなを更新しました')
  }

  async function handleDelete(e) {
    const ok = window.confirm(`「${e.word}（${e.reading}）」を削除しますか？`)
    if (!ok) return
    await deleteFuriganaEntry(e.id)
    await onChanged('ふりがなを削除しました')
  }

  return (
    <div className="card">
      <h2>ふりがな辞書</h2>
      <p className="lead" style={{ marginBottom: 10 }}>
        ここに登録した単語は、子どもアプリの例文・意味・答えの中に出てきたとき、自動的にふりがな（ルビ）が振られます。
      </p>

      <div className="filters">
        <input ref={wordInputRef} type="text" placeholder="単語" style={{ width: 140 }} value={word} onChange={(e) => setWord(e.target.value)} />
        <input type="text" placeholder="読み（ひらがな）" style={{ width: 140 }} value={reading} onChange={(e) => setReading(e.target.value)} />
        <button className="btn btn-primary" disabled={saving} onClick={handleAdd}>追加する</button>
        <input type="text" placeholder="検索" style={{ width: 140, marginLeft: 'auto' }} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-scroll">
        <table className="responsive-table furigana-table">
          <thead><tr><th>単語</th><th>読み</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan="3" className="empty">登録がありません</td></tr>}
            {filtered.map((e) => (
              <tr key={e.id}>
                {editingId === e.id ? (
                  <>
                    <td><input type="text" value={editWord} onChange={(ev) => setEditWord(ev.target.value)} /></td>
                    <td><input type="text" value={editReading} onChange={(ev) => setEditReading(ev.target.value)} /></td>
                    <td className="row-actions">
                      <button className="btn btn-primary" onClick={saveEdit}>保存</button>
                      <button className="btn btn-secondary" onClick={() => setEditingId(null)}>キャンセル</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><b>{e.word}</b></td>
                    <td>{e.reading}</td>
                    <td className="row-actions">
                      <button className="btn btn-secondary" onClick={() => startEdit(e)}>編集</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(e)}>削除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

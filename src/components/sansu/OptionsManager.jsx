import { useState } from 'react'
import { addSansuOption, deleteSansuOption } from '../../lib/sansuApi'

// 単元・教材名の選択肢の追加・削除（ふだんは閉じておく）
export default function OptionsManager({ units, sources, onChange }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button type="button" className="options-manager-toggle" onClick={() => setOpen(true)}>
        単元・教材名の一覧を管理する
      </button>
    )
  }

  return (
    <div className="options-manager">
      <div className="options-manager-header">
        <h3>単元・教材名の管理</h3>
        <button type="button" onClick={() => setOpen(false)}>閉じる</button>
      </div>
      <OptionSection title="単元" type="unit" items={units} placeholder="新しい単元名" onChange={onChange} />
      <OptionSection title="テスト／教材名" type="source" items={sources} placeholder="新しい教材名" onChange={onChange} />
    </div>
  )
}

function OptionSection({ title, type, items, placeholder, onChange }) {
  const [name, setName] = useState('')

  async function add() {
    if (!name.trim()) return
    try {
      await addSansuOption(type, name)
      setName('')
      onChange()
    } catch (e) {
      window.alert(`追加できませんでした：${e.message}`)
    }
  }

  async function remove(id) {
    if (!window.confirm('この項目を削除しますか？（すでに登録済みの問題には影響しません）')) return
    try {
      await deleteSansuOption(id)
      onChange()
    } catch (e) {
      window.alert(`削除できませんでした：${e.message}`)
    }
  }

  return (
    <div className="options-manager-section">
      <h4>{title}</h4>
      <ul className="options-manager-list">
        {items.map((o) => (
          <li key={o.id}>
            <span>{o.name}</span>
            <button type="button" onClick={() => remove(o.id)}>削除</button>
          </li>
        ))}
      </ul>
      <div className="options-manager-add">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholder} />
        <button type="button" onClick={add}>追加</button>
      </div>
    </div>
  )
}

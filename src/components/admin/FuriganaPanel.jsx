import { useState } from 'react'
import { FuriganaTable, FuriganaAddForm } from './FuriganaEditor'

// ふりがな辞書タブ：登録した単語は、子どもアプリの例文・意味・答えに出てきたとき自動でルビが振られる
export default function FuriganaPanel({ entries, onChanged }) {
  const [search, setSearch] = useState('')
  const filtered = entries.filter((e) => !search || e.word.includes(search) || e.reading.includes(search))

  return (
    <div className="card">
      <h2>ふりがな辞書</h2>
      <p className="lead" style={{ marginBottom: 10 }}>
        ここに登録した単語は、子どもアプリの例文・意味・答えの中に出てきたとき、自動的にふりがな（ルビ）が振られます。
      </p>
      <FuriganaAddForm onChanged={onChanged}>
        <input type="text" placeholder="検索" style={{ width: 140, marginLeft: 'auto' }} value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="btn btn-secondary" onClick={() => setSearch('')}>検索をリセット</button>}
      </FuriganaAddForm>
      <div className="table-scroll">
        <FuriganaTable entries={filtered} onChanged={onChanged} emptyText={`🔍 登録がありません${search ? '（検索条件を見直してみてください）' : ''}`} />
      </div>
    </div>
  )
}

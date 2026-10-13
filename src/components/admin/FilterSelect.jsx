// 「すべて」＋選択肢のセレクトボックス（管理画面の絞り込み用）
// options: 文字列の配列。labelOf で表示名を変えられる
export default function FilterSelect({ value, onChange, allLabel, options, labelOf = (v) => v }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((o) => <option key={o} value={o}>{labelOf(o)}</option>)}
    </select>
  )
}

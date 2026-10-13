import { useState } from 'react'
import { insertQuestions } from '../../../lib/api'
import { CSV_EXAMPLE, parseCsvRows, buildQuestionFromRow, typeLabel } from '../../../lib/questionTypes'
import { useToast } from '../useToast'

// 紙の問題集から作ったCSVを取り込む（行ごとの answer_type 列で出題形式を自動判定）
export default function ImportPanel({ onImported }) {
  const [notify, toastEl] = useToast()
  const [csv, setCsv] = useState('')
  const [result, setResult] = useState('')
  const [errors, setErrors] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [importing, setImporting] = useState(false)

  function readFile(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      notify('.csvファイルを選択してください')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      // Excel等が付与するBOM(先頭の見えない文字)を除去しておく
      setCsv(String(e.target.result).replace(/^﻿/, ''))
      setResult('')
      setErrors([])
    }
    reader.readAsText(file, 'utf-8')
  }

  async function handleImport() {
    const rows = parseCsvRows(csv)
    if (rows.length === 0) { setResult('CSVの内容を確認してください（見出し行＋データ行が必要です）'); setErrors([]); return }

    const records = []
    const rowErrors = []
    rows.forEach((row, i) => {
      try {
        records.push(buildQuestionFromRow(row))
      } catch (e) {
        rowErrors.push(`${i + 2}行目: ${e.message}`)
      }
    })
    setErrors(rowErrors)
    if (records.length === 0) { setResult('取り込める行がありませんでした。'); return }

    setImporting(true)
    try {
      await insertQuestions(records)
      const typeCounts = records.reduce((acc, r) => ({ ...acc, [r.answer_type]: (acc[r.answer_type] || 0) + 1 }), {})
      const summary = Object.entries(typeCounts).map(([t, n]) => `${typeLabel(t)}${n}問`).join('／')
      setResult(`${records.length}問を取り込みました（${summary}）`)
      setCsv('')
      onImported(records.length, summary)
    } catch (e) {
      notify(`取り込みに失敗しました：${e.message}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="card">
      <h2>紙の問題集から作ったCSVを取り込む</h2>
      <p className="lead" style={{ marginBottom: 14 }}>
        写真から読み取った問題をこのチャットでCSV化してから、下に貼り付けるか、CSVファイルをドラッグ&ドロップしてください。行ごとの<code>answer_type</code>列から出題形式を自動判定するので、事前に形式を選ぶ必要はありません。使わない列は空欄のままでOKです。
      </p>
      <div className="format-hint">{CSV_EXAMPLE}</div>

      <label
        className={`csv-dropzone ${dragOver ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); readFile(e.dataTransfer.files?.[0]) }}
      >
        <div>📄 CSVファイルをここにドラッグ&ドロップ、またはクリックして選択</div>
        <input type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => { readFile(e.target.files?.[0]); e.target.value = '' }} />
      </label>

      <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={CSV_EXAMPLE} />
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" disabled={importing} onClick={handleImport}>
          {importing ? <span className="spinner-inline"><span className="spinner" />取り込み中…</span> : '取り込む'}
        </button>
      </div>
      {result && <div className="preview-count">{result}</div>}
      {errors.length > 0 && (
        <div className="preview-count" style={{ color: '#D94848' }}>
          読み込めなかった行があります：<br />
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
      {toastEl}
    </div>
  )
}

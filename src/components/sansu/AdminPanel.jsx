import { useEffect, useState } from 'react'
import {
  SANSU_DIFFICULTIES, difficultyLabel, fetchRecentSansuQuestions, insertSansuQuestion, deleteSansuQuestion,
  fetchSansuOptions, addSansuOption, uploadSansuImage
} from '../../lib/sansuApi'
import { loadString, saveString, STORAGE_KEYS } from '../../lib/storage'
import CropModal from './CropModal'
import OptionsManager from './OptionsManager'

const RECENT_LIMIT = 200 // 下の一覧に出す件数
const NEW_OPTION_VALUE = '__new__'

// さんすうナビの問題登録（/admin/sansu）
export default function AdminPanel() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [options, setOptions] = useState({ units: [], sources: [] })

  // 単元・教材名：一覧から選ぶか、新しく入力する（新しい名前は登録時に一覧へ追加する）
  const [unit, setUnit] = useState({ selected: '', typed: '' })
  const [source, setSource] = useState({ selected: '', typed: '' })
  const [difficulty, setDifficulty] = useState('normal')
  const [questionText, setQuestionText] = useState('')
  const [answer, setAnswer] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [images, setImages] = useState({ question: [], answer: [] }) // 切り取り済みの画像ファイル
  const [cropQueue, setCropQueue] = useState([]) // [{ id, file, target: 'question'|'answer' }]（1枚ずつ切り取る）
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadQuestions()
    loadOptions(true)
  }, [])

  async function loadOptions(restoreLast = false) {
    try {
      const opts = await fetchSansuOptions()
      setOptions(opts)
      if (!restoreLast) return
      // 前回選択したものを初期値に（まだ選ばれていない場合のみ）
      const lastUnit = loadString(STORAGE_KEYS.sansuLastUnit)
      if (lastUnit && opts.units.some((u) => u.name === lastUnit)) setUnit((p) => (p.selected ? p : { selected: lastUnit, typed: '' }))
      const lastSource = loadString(STORAGE_KEYS.sansuLastSource)
      if (lastSource && opts.sources.some((s) => s.name === lastSource)) setSource((p) => (p.selected ? p : { selected: lastSource, typed: '' }))
    } catch (e) {
      setMessage(`単元・教材名を読み込めませんでした：${e.message}`)
    }
  }

  async function loadQuestions() {
    setLoading(true)
    try {
      setQuestions(await fetchRecentSansuQuestions(RECENT_LIMIT))
    } catch (e) {
      setMessage(`問題を読み込めませんでした：${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function queueFilesForCrop(fileList, target) {
    setCropQueue((prev) => [...prev, ...Array.from(fileList || []).map((file, i) => ({ id: `${Date.now()}-${i}`, file, target }))])
  }

  const cropping = cropQueue[0] || null
  function handleCropConfirm(croppedFile) {
    setImages((prev) => ({ ...prev, [cropping.target]: [...prev[cropping.target], croppedFile] }))
    setCropQueue((prev) => prev.slice(1))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const finalUnit = (unit.selected || unit.typed).trim()
    const finalSource = (source.selected || source.typed).trim()
    if (!finalUnit || (!answer.trim() && images.answer.length === 0)) {
      setMessage('単元は必須です。答えはテキストか画像のどちらかを入力してください')
      return
    }
    setUploading(true)
    setMessage('')
    try {
      const imageUrls = []
      for (const file of images.question) imageUrls.push(await uploadSansuImage(file))
      const answerImageUrls = []
      for (const file of images.answer) answerImageUrls.push(await uploadSansuImage(file))

      await insertSansuQuestion({
        unit: finalUnit,
        difficulty,
        question_text: questionText.trim(),
        answer: answer.trim() || null,
        image_urls: imageUrls,
        answer_image_urls: answerImageUrls,
        source_name: finalSource || null,
        page_number: pageNumber.trim() || null
      })

      // 新しく入力した名前は、選択肢の一覧に登録する
      if (!unit.selected && unit.typed.trim()) await addSansuOption('unit', unit.typed)
      if (!source.selected && source.typed.trim()) await addSansuOption('source', source.typed)
      loadOptions()

      // 前回選択値として記憶（続けて同じ単元・教材を登録しやすくする）
      saveString(STORAGE_KEYS.sansuLastUnit, finalUnit)
      if (finalSource) saveString(STORAGE_KEYS.sansuLastSource, finalSource)
      setUnit({ selected: finalUnit, typed: '' })
      setSource({ selected: finalSource, typed: '' })

      setMessage('登録しました')
      setQuestionText('')
      setAnswer('')
      setImages({ question: [], answer: [] })
      loadQuestions()
    } catch (err) {
      setMessage('エラー: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('この問題を削除しますか？')) return
    try {
      await deleteSansuQuestion(id)
      loadQuestions()
    } catch (e) {
      setMessage(`削除できませんでした：${e.message}`)
    }
  }

  return (
    <div className="admin-panel">
      <a className="home-link" href="/admin">← 管理画面へもどる</a>
      <h1>さんすうナビ 管理</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <OptionSelect label="テスト／教材名" options={options.sources} value={source} onChange={setSource} placeholder="新しい教材名を入力" />

        <label>
          ページ数
          <input type="text" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} placeholder="例: 12" />
        </label>

        <OptionSelect label="単元" options={options.units} value={unit} onChange={setUnit} placeholder="新しい単元名を入力" />

        <label>
          難易度
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {SANSU_DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </label>

        <label>
          問題文
          <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="問題文（図形問題は補足のみでも可）" rows={6} />
        </label>

        <ImageInput
          label="画像（図形問題など、複数登録可）"
          files={images.question}
          onPick={(list) => queueFilesForCrop(list, 'question')}
          onRemove={(i) => setImages((p) => ({ ...p, question: p.question.filter((_, idx) => idx !== i) }))}
        />

        <label>
          答え（テキストまたは画像のどちらか）
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="答え（画像のみで登録する場合は空欄可）" />
        </label>

        <ImageInput
          label="答えの画像（図形の解説など、複数登録可）"
          files={images.answer}
          onPick={(list) => queueFilesForCrop(list, 'answer')}
          onRemove={(i) => setImages((p) => ({ ...p, answer: p.answer.filter((_, idx) => idx !== i) }))}
        />

        <button type="submit" className="primary-button" disabled={uploading}>
          {uploading ? 'アップロード中...' : '登録する'}
        </button>

        {message && <p className="admin-message">{message}</p>}
      </form>

      <OptionsManager units={options.units} sources={options.sources} onChange={() => loadOptions()} />

      <h2>登録済み問題（最新{RECENT_LIMIT}件）</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>教材名</th><th>ページ</th><th>単元</th><th>難易度</th><th>問題文</th><th>答え</th>
              <th>画像</th><th>答え画像</th><th>連続正解</th><th>習得</th><th>最終回答</th><th></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.source_name}</td>
                <td>{q.page_number}</td>
                <td>{q.unit}</td>
                <td>{difficultyLabel(q.difficulty)}</td>
                <td>{q.question_text}</td>
                <td>{q.answer}</td>
                <td>{q.image_urls?.length > 0 ? `${q.image_urls.length}枚` : ''}</td>
                <td>{q.answer_image_urls?.length > 0 ? `${q.answer_image_urls.length}枚` : ''}</td>
                <td>{q.consecutive_correct}</td>
                <td>{q.is_mastered ? '✓' : ''}</td>
                <td>{q.last_answered_at ? new Date(q.last_answered_at).toLocaleDateString('ja-JP') : ''}</td>
                <td><button onClick={() => handleDelete(q.id)}>削除</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {cropping && (
        <CropModal
          key={cropping.id}
          file={cropping.file}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropQueue((prev) => prev.slice(1))}
        />
      )}
    </div>
  )
}

// 一覧から選ぶか、「＋ 新しく追加」で名前を入力するセレクト
// value: { selected: 一覧から選んだ名前, typed: 入力中の新しい名前 }
function OptionSelect({ label, options, value, onChange, placeholder }) {
  const known = options.some((o) => o.name === value.selected)
  return (
    <label>
      {label}
      <select
        value={known ? value.selected : value.selected ? NEW_OPTION_VALUE : ''}
        onChange={(e) => onChange({ selected: e.target.value === NEW_OPTION_VALUE ? '' : e.target.value, typed: '' })}
      >
        <option value="">選択してください</option>
        {options.map((o) => <option key={o.id} value={o.name}>{o.name}</option>)}
        <option value={NEW_OPTION_VALUE}>＋ 新しく追加</option>
      </select>
      {!known && (
        <input type="text" value={value.typed} onChange={(e) => onChange({ selected: '', typed: e.target.value })} placeholder={placeholder} className="new-option-input" />
      )}
    </label>
  )
}

// 画像を選ぶ（選んだあと切り取り画面が出る）＋選んだ画像の一覧
function ImageInput({ label, files, onPick, onRemove }) {
  return (
    <>
      <label>
        {label}
        <input type="file" accept="image/*" multiple onChange={(e) => { onPick(e.target.files); e.target.value = '' }} />
      </label>
      {files.length > 0 && (
        <div className="image-file-list">
          {files.map((f, i) => (
            <span key={i} className="image-file-chip">
              {f.name}
              <button type="button" onClick={() => onRemove(i)}>×</button>
            </span>
          ))}
        </div>
      )}
    </>
  )
}

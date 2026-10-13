import { addFurigana } from '../../../lib/furigana'

// 辞書にある難しい漢字にだけ、ふりがな（ルビ）を付けて表示する
export default function Ruby({ text }) {
  if (!text) return null
  return <span dangerouslySetInnerHTML={{ __html: addFurigana(text) }} />
}

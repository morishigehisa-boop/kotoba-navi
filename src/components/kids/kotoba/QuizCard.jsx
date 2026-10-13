import Ruby from './Ruby'
import AnswerButtons from '../AnswerButtons'

// ことばナビの問題カード。管理画面の「プレビュー」でも同じ部品を使う（showActions=false）
// content の形は answer_type ごとに違う（supabase/schema.sql 参照）
export default function QuizCard({ item, revealed, reviewMode, choiceFeedback, onReveal, onAnswer, onChoice, showActions = true }) {
  const c = item.content
  const actions = showActions && <AnswerButtons revealed={revealed} onReveal={onReveal} onAnswer={onAnswer} />
  const reviewNote = reviewMode && <div className="hint" style={{ marginBottom: 8 }}>📖 復習タイム（正解数にはカウントされません）</div>

  if (c.choices) {
    return (
      <div>
        {reviewNote}
        <div className="card" style={{ alignItems: 'flex-start' }}>
          <div className="label">{item.category === '同訓異字' ? '同訓' : '同音'}</div>
          <div className="reading-tag" style={{ marginTop: 20 }}>{c.reading}</div>
          <div className="sentence" style={{ marginTop: 12 }}><Ruby text={c.sentence} /></div>
          {c.q && (
            <>
              <div className="label label-2">意味</div>
              <div className="meaning with-sentence"><Ruby text={c.q} /></div>
            </>
          )}
        </div>
        <div className="choice-grid">
          {c.choices.map((choice) => {
            let cls = 'choice-btn'
            if (choiceFeedback) {
              if (choice === choiceFeedback.correct) cls += ' choice-correct'
              else if (choice === choiceFeedback.chosen) cls += ' choice-wrong'
            }
            return (
              <button key={choice} className={cls} disabled={!!choiceFeedback} onClick={() => onChoice(choice)}>
                <Ruby text={choice} />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (c.sentenceA) {
    const pair = PAIR_LABELS[item.category] || PAIR_LABELS.default
    return (
      <div>
        {reviewNote}
        <div className="card" style={{ alignItems: 'flex-start' }}>
          <div className={pair.className}>{pair.label}</div>
          {[[c.sentenceA, c.answerA], [c.sentenceB, c.answerB]].map(([sentence, answer], i) => (
            <div key={i} className="pair-block" style={i === 0 ? { marginTop: 20 } : undefined}>
              <div className="pair-sentence">
                <span className="pair-num">{i + 1}</span>
                <Ruby text={sentence} />
              </div>
              <div className={`pair-answer ${revealed ? '' : 'pair-answer-hidden'}`}><Ruby text={answer} /></div>
            </div>
          ))}
          {!revealed && <div className="hint">{pair.hint}</div>}
        </div>
        {actions}
      </div>
    )
  }

  const answers = Array.isArray(c.a) ? c.a : [c.a]
  const meaningFirst = item.answer_type === 'meaning_first_fill'
  return (
    <div>
      {reviewNote}
      <div className="card">
        {meaningFirst ? (
          <>
            <div className="label">意味</div>
            <div className="meaning"><Ruby text={c.q} /></div>
            <div className="label label-2">例文</div>
            <div className="sentence with-meaning"><Ruby text={c.sentence} /></div>
          </>
        ) : (
          <>
            {c.sentence ? (
              <>
                <div className="label">例文</div>
                <div className="sentence"><Ruby text={c.sentence} /></div>
                <div className="label label-2">意味</div>
              </>
            ) : (
              <div className="label">意味</div>
            )}
            <div className={`meaning${c.sentence ? ' with-sentence' : ''}`}><Ruby text={c.q} /></div>
          </>
        )}
        {c.shown && <div className="shown-proverb"><Ruby text={c.shown} /></div>}
        {!revealed ? (
          <div className="hint">{questionHint(item)}</div>
        ) : (
          <>
            {answers.length > 1 && <div className="multi-badge">答えは {answers.length}つあります</div>}
            {answers.map((x) => <div className="answer" key={x}><Ruby text={x} /></div>)}
          </>
        )}
      </div>
      {actions}
    </div>
  )
}

// 二文穴埋め（類義語・対義語・対になる表現）の見出しとヒント
const PAIR_LABELS = {
  類義語: { label: '類義語', className: 'label label-ruigigo', hint: 'この二つの文章の意味になる類義語は何？' },
  対義語: { label: '対義語', className: 'label label-taigigo', hint: 'この二つの文章の意味になる対義語は何？' },
  default: { label: '対になる表現', className: 'label', hint: '2つとも何ということわざ？' }
}

function questionHint(item) {
  const c = item.content
  if (c.shown) return '似た意味のことわざは？'
  if (item.answer_type === 'meaning_first_fill') return `当てはまる${item.category}は？`
  if (item.answer_type === 'wago_fill') return '当てはまる和語は？'
  if (c.sentence) return '当てはまる慣用句は？'
  return '答えを考えてみよう'
}

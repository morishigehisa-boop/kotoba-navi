import kidsCss from '../kids/kids.css?raw'
import { addFurigana } from '../../lib/furigana'

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// addFuriganaはHTML(rubyタグ等)を返すので、素通りさせつつルビ変換のみ行う
function rich(s) {
  return addFurigana(s || '')
}

function cardInner(item, revealed) {
  const c = item.content

  if (c.choices) {
    const buttons = c.choices.map((choice) => {
      const cls = revealed && choice === c.answer ? 'choice-btn choice-correct' : 'choice-btn'
      return `<button class="${cls}" disabled>${rich(choice)}</button>`
    }).join('')
    return `
      <div class="label">どうおん</div>
      <div class="reading-tag" style="margin-top:20px;">${esc(c.reading)}</div>
      <div class="sentence" style="margin-top:12px;">${rich(c.sentence)}</div>
      <div class="choice-grid">${buttons}</div>
    `
  }

  if (c.sentenceA) {
    const isRuigigo = item.category === '類義語'
    const isTaigigo = item.category === '対義語'
    const labelText = isRuigigo ? '類義語' : isTaigigo ? '対義語' : '対になる表現'
    const labelClass = isRuigigo ? 'label label-ruigigo' : isTaigigo ? 'label label-taigigo' : 'label'
    const hintText = isRuigigo ? 'この二つの文章の意味になる類義語はなに？' : isTaigigo ? 'この二つの文章の意味になる対義語はなに？' : '2つとも なんという ことわざ？'
    return `
      <div class="${labelClass}">${labelText}</div>
      <div class="pair-block" style="margin-top:20px;">
        <div class="pair-sentence"><span class="pair-num">1</span>${rich(c.sentenceA)}</div>
        ${revealed ? `<div class="pair-answer">${rich(c.answerA)}</div>` : ''}
      </div>
      <div class="pair-block">
        <div class="pair-sentence"><span class="pair-num">2</span>${rich(c.sentenceB)}</div>
        ${revealed ? `<div class="pair-answer">${rich(c.answerB)}</div>` : ''}
      </div>
      ${!revealed ? `<div class="hint">${hintText}</div>` : ''}
    `
  }

  const isArrayAnswer = Array.isArray(c.a)
  const sentenceBlock = c.sentence
    ? `<div class="label">れいぶん</div><div class="sentence">${rich(c.sentence)}</div><div class="label label-2">いみ</div>`
    : `<div class="label">いみ</div>`
  const hintText = c.shown ? 'にた いみの ことわざは？' : c.sentence ? 'あてはまる 慣用句は？' : 'こたえを かんがえてみよう'
  let answerBlock = ''
  if (revealed) {
    if (isArrayAnswer) {
      answerBlock = (c.a.length > 1 ? `<div class="multi-badge">こたえは ${c.a.length}つ あります</div>` : '') +
        c.a.map((x) => `<div class="answer">${rich(x)}</div>`).join('')
    } else {
      answerBlock = `<div class="answer">${rich(c.a)}</div>`
    }
  }
  return `
    ${sentenceBlock}
    <div class="meaning ${c.sentence ? 'with-sentence' : ''}">${rich(c.q)}</div>
    ${c.shown ? `<div class="shown-proverb">${rich(c.shown)}</div>` : ''}
    ${!revealed ? `<div class="hint">${hintText}</div>` : answerBlock}
  `
}

export function buildPreviewHtml(item, revealed) {
  return `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<style>${kidsCss}
body{ padding:16px; }
.app{ max-width:none; padding:0; }
.card{ min-height:200px; }
</style></head>
<body>
<div class="app">
  <div class="card">${cardInner(item, revealed)}</div>
</div>
</body></html>`
}

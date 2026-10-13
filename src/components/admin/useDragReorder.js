import { useState } from 'react'

// 表の行をドラッグ&ドロップで並べ替える（やること一覧・問題集一覧で共通）。
// 使い方: const drag = useDragReorder(items, onReorder); <tr {...drag.rowProps(item)} className={drag.rowClass(item)}>
// onReorder には並べ替え後の配列を渡す
export function useDragReorder(items, onReorder) {
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)

  function drop(targetId) {
    setOverId(null)
    setDragId(null)
    if (dragId === null || dragId === targetId) return
    const next = [...items]
    const [moved] = next.splice(next.findIndex((x) => x.id === dragId), 1)
    next.splice(next.findIndex((x) => x.id === targetId), 0, moved)
    onReorder(next)
  }

  // スマホ向け：ボタンで1つ上・下へ
  function move(index, offset) {
    const target = index + offset
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onReorder(next)
  }

  const rowProps = (item) => ({
    draggable: true,
    onDragStart: () => setDragId(item.id),
    onDragOver: (e) => { e.preventDefault(); setOverId(item.id) },
    onDragEnd: () => { setDragId(null); setOverId(null) },
    onDrop: () => drop(item.id)
  })
  const rowClass = (item) => `drag-row ${overId === item.id ? 'drag-over' : ''} ${dragId === item.id ? 'dragging' : ''}`

  return { rowProps, rowClass, move }
}

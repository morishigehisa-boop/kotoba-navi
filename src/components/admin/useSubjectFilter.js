import { useState } from 'react'
import { SUBJECTS } from '../../lib/tasks'

// 教科フィルタの選択状態を、画面ごとに localStorage へ保存して次回も引き継ぐ。
// 保存できない環境（プライベートモードなど）でも、そのまま動く。
export function useSubjectFilter(storageKey) {
  const [subjects, setSubjectsState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (Array.isArray(saved)) return SUBJECTS.filter((s) => saved.includes(s)) // 教科の増減があっても安全に復元
    } catch {}
    return SUBJECTS
  })

  const setSubjects = (next) => {
    const value = typeof next === 'function' ? next(subjects) : next
    setSubjectsState(value)
    try { localStorage.setItem(storageKey, JSON.stringify(value)) } catch {}
  }
  return [subjects, setSubjects]
}

import { useState } from 'react'
import { SUBJECTS } from '../../lib/tasks'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../../lib/storage'

// 教科フィルタの選択状態を端末に保存して、次回も（やること一覧・予定カレンダーで共通に）引き継ぐ
export function useSubjectFilter() {
  const [subjects, setSubjectsState] = useState(() => {
    const saved = loadJSON(STORAGE_KEYS.adminSubjects)
    return Array.isArray(saved) ? SUBJECTS.filter((s) => saved.includes(s)) : SUBJECTS // 教科の増減があっても安全に復元
  })
  const setSubjects = (value) => {
    setSubjectsState(value)
    saveJSON(STORAGE_KEYS.adminSubjects, value)
  }
  return [subjects, setSubjects]
}

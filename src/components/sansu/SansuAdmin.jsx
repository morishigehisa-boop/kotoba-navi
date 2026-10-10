import { useEffect } from 'react'
import AdminPanel from './AdminPanel'
import './sansu.css'

// /admin/sansu：さんすうナビの問題登録。ことばナビの管理画面とはCSSが衝突するため、別ページとして開く
export default function SansuAdmin() {
  useEffect(() => { document.title = 'さんすうナビ 管理' }, [])
  return <AdminPanel />
}

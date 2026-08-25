import { lazy, Suspense } from 'react'

// 子どもアプリと管理画面は、開いた方だけを読み込む（初回の読み込みを軽くする）
const KidsApp = lazy(() => import('./components/kids/KidsApp'))
const AdminApp = lazy(() => import('./components/admin/AdminApp'))

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin')
  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: 'system-ui', color: '#8A8678' }}>よみこみちゅう…</div>}>
      {isAdmin ? <AdminApp /> : <KidsApp />}
    </Suspense>
  )
}

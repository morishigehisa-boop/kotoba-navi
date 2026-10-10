import { lazy, Suspense } from 'react'

// 子どもアプリと管理画面は、開いた方だけを読み込む（初回の読み込みを軽くする）
const KidsApp = lazy(() => import('./components/kids/KidsApp'))
const AdminApp = lazy(() => import('./components/admin/AdminApp'))
// さんすうナビは別ページ（/sansu, /admin/sansu）。CSSが衝突しないよう、ページごとに必要な分だけ読み込む
const SansuApp = lazy(() => import('./components/sansu/SansuApp'))
const SansuAdmin = lazy(() => import('./components/sansu/SansuAdmin'))

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  const isAdmin = path.startsWith('/admin')
  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: 'system-ui', color: '#8A8678' }}>よみこみちゅう…</div>}>
      {path === '/admin/sansu' ? <SansuAdmin /> : isAdmin ? <AdminApp /> : path === '/sansu' ? <SansuApp /> : <KidsApp />}
    </Suspense>
  )
}

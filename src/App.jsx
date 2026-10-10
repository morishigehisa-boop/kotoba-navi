import { lazy, Suspense } from 'react'
import { LoadingView } from './components/common/Status'

// 子どもアプリと管理画面は、開いた方だけを読み込む（初回の読み込みを軽くする）
const KidsApp = lazy(() => import('./components/kids/KidsApp'))
const AdminApp = lazy(() => import('./components/admin/AdminApp'))
// さんすうナビの問題登録だけは、管理画面とCSSが衝突するため別ページ（/admin/sansu）にしている
const SansuAdmin = lazy(() => import('./components/sansu/SansuAdmin'))

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  let page
  if (path === '/admin/sansu') page = <SansuAdmin />
  else if (path.startsWith('/admin')) page = <AdminApp />
  else page = <KidsApp initialScreen={path === '/sansu' ? 'sansu' : 'home'} /> // /sansu は、ブックマーク用にさんすうナビを直接開く
  return <Suspense fallback={<LoadingView />}>{page}</Suspense>
}

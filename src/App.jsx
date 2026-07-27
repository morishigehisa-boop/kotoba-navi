import KidsApp from './components/kids/KidsApp'
import AdminApp from './components/admin/AdminApp'

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin')
  return isAdmin ? <AdminApp /> : <KidsApp />
}

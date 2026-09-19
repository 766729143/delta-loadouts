import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

function Gate() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="mt-20 text-center text-sm text-neutral-600">加载中…</p>
  }

  return user ? <Home /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}

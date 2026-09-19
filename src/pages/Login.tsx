import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        const { needsConfirm } = await signUp(email, password)
        setNotice(
          needsConfirm
            ? '注册成功，请到邮箱点击确认链接后再登录。'
            : '注册成功，正在进入…',
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-600 focus:outline-none'

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <h1 className="text-xl font-semibold text-neutral-100">三角洲行动 · 改枪码收藏</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === 'signin' ? '登录以同步你的改枪码' : '创建账号，手机电脑共用一份数据'}
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">邮箱</span>
            <input
              className={field}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">密码</span>
            <input
              className={field}
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {notice && <p className="mt-4 text-sm text-emerald-400">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 min-h-11 w-full rounded-lg bg-emerald-500 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
        >
          {busy ? '处理中…' : mode === 'signin' ? '登录' : '注册'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setNotice(null)
          }}
          className="mt-3 min-h-11 w-full text-sm text-neutral-400 transition-colors hover:text-neutral-200"
        >
          {mode === 'signin' ? '没有账号？去注册' : '已有账号？去登录'}
        </button>
      </form>
    </div>
  )
}

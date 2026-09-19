import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoadoutCard } from '../components/LoadoutCard'
import { LoadoutForm } from '../components/LoadoutForm'
import { useAuth } from '../contexts/AuthContext'
import {
  createLoadout,
  deleteLoadout,
  listLoadouts,
  updateLoadout,
  type Loadout,
  type LoadoutInput,
} from '../lib/loadouts'

// 筛选状态存在 URL query 里，刷新或分享链接都能保留
function readParams() {
  const params = new URLSearchParams(window.location.search)
  return { q: params.get('q') ?? '', weapon: params.get('weapon') ?? '' }
}

export function Home() {
  const { user, signOut } = useAuth()
  const [loadouts, setLoadouts] = useState<Loadout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Loadout | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [filters, setFilters] = useState(readParams)

  const refresh = useCallback(async () => {
    try {
      setLoadouts(await listLoadouts())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.weapon) params.set('weapon', filters.weapon)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [filters])

  const weapons = useMemo(
    () => [...new Set(loadouts.map((l) => l.weapon))].sort((a, b) => a.localeCompare(b, 'zh')),
    [loadouts],
  )

  const visible = useMemo(() => {
    const keyword = filters.q.trim().toLowerCase()
    return loadouts.filter((l) => {
      if (filters.weapon && l.weapon !== filters.weapon) return false
      if (!keyword) return true
      return (
        l.name.toLowerCase().includes(keyword) ||
        l.code.toLowerCase().includes(keyword) ||
        (l.note ?? '').toLowerCase().includes(keyword)
      )
    })
  }, [loadouts, filters])

  async function handleSubmit(input: LoadoutInput) {
    if (editing) {
      await updateLoadout(editing.id, input)
    } else {
      await createLoadout(input)
    }
    await refresh()
  }

  async function handleDelete(loadout: Loadout) {
    if (!window.confirm(`确定删除「${loadout.name}」？此操作无法撤销。`)) return
    try {
      await deleteLoadout(loadout.id)
      setLoadouts((prev) => prev.filter((l) => l.id !== loadout.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }

  const control =
    'min-h-11 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-base text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-600 focus:outline-none'

  return (
    <div className="mx-auto min-h-svh max-w-2xl px-4 pb-24">
      <header className="flex items-center justify-between gap-3 py-5">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-neutral-100">改枪码收藏</h1>
          <p className="truncate text-xs text-neutral-500">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="min-h-11 shrink-0 rounded-lg border border-neutral-800 px-3 text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          退出
        </button>
      </header>

      <div className="flex gap-2">
        <input
          className={`${control} min-w-0 flex-1`}
          type="search"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="搜索名称、码或备注"
        />
        <select
          className={`${control} shrink-0`}
          value={filters.weapon}
          onChange={(e) => setFilters((f) => ({ ...f, weapon: e.target.value }))}
        >
          <option value="">全部武器</option>
          {weapons.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-neutral-600">
        共 {loadouts.length} 条
        {visible.length !== loadouts.length && ` · 筛出 ${visible.length} 条`}
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-center text-sm text-neutral-600">加载中…</p>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-600">
          {loadouts.length === 0 ? '还没有改枪码，点右下角按钮添加第一条。' : '没有匹配的结果。'}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((l) => (
            <LoadoutCard
              key={l.id}
              loadout={l}
              onEdit={(target) => {
                setEditing(target)
                setFormOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          setEditing(null)
          setFormOpen(true)
        }}
        aria-label="新增改枪码"
        className="fixed right-5 bottom-6 z-40 size-14 rounded-full bg-emerald-500 text-2xl leading-none text-emerald-950 shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        +
      </button>

      {formOpen && (
        <LoadoutForm
          initial={editing}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

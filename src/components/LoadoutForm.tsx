import { useEffect, useState } from 'react'
import { WEAPONS } from '../constants/weapons'
import type { Loadout, LoadoutInput } from '../lib/loadouts'

interface Props {
  initial?: Loadout | null
  onSubmit: (input: LoadoutInput) => Promise<void>
  onClose: () => void
}

const EMPTY: LoadoutInput = { name: '', code: '', weapon: WEAPONS[0], note: '' }

export function LoadoutForm({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<LoadoutInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(
      initial
        ? {
            name: initial.name,
            code: initial.code,
            weapon: initial.weapon,
            note: initial.note ?? '',
          }
        : EMPTY,
    )
    setError(null)
  }, [initial])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return setError('请填写名称')
    if (!form.code.trim()) return setError('请填写改枪码')

    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        name: form.name.trim(),
        code: form.code.trim(),
        weapon: form.weapon,
        note: form.note?.trim() ? form.note.trim() : null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-600 focus:outline-none'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-2xl"
      >
        <h2 className="text-lg font-semibold text-neutral-100">
          {initial ? '编辑改枪码' : '新增改枪码'}
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">名称</span>
            <input
              className={field}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="例如：长弓溪谷 中距离稳枪"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">武器类型</span>
            <select
              className={field}
              value={form.weapon}
              onChange={(e) => setForm({ ...form, weapon: e.target.value })}
            >
              {WEAPONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">改枪码</span>
            <textarea
              className={`${field} min-h-24 resize-y font-mono text-sm`}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="粘贴完整的改枪码"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-neutral-400">备注 / 心得（可选）</span>
            <textarea
              className={`${field} min-h-20 resize-y`}
              value={form.note ?? ''}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="例如：腰射准，经济局好用"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-lg border border-neutral-700 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 flex-1 rounded-lg bg-emerald-500 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:opacity-50"
          >
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}

import type { Loadout } from '../lib/loadouts'
import { CopyButton } from './CopyButton'

const dateFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' })

interface Props {
  loadout: Loadout
  onEdit: (loadout: Loadout) => void
  onDelete: (loadout: Loadout) => void
}

export function LoadoutCard({ loadout, onEdit, onDelete }: Props) {
  return (
    <li className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-neutral-100">{loadout.name}</h3>
        <span className="shrink-0 rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
          {loadout.weapon}
        </span>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-lg bg-neutral-950 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-emerald-300 select-all">
        {loadout.code}
      </pre>

      {loadout.note && (
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-neutral-400">
          {loadout.note}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CopyButton text={loadout.code} />
        <button
          type="button"
          onClick={() => onEdit(loadout)}
          className="min-h-11 rounded-lg border border-neutral-700 px-4 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          编辑
        </button>
        <button
          type="button"
          onClick={() => onDelete(loadout)}
          className="min-h-11 rounded-lg border border-neutral-800 px-4 text-sm text-neutral-500 transition-colors hover:border-red-900 hover:text-red-400"
        >
          删除
        </button>
        <time
          dateTime={loadout.created_at}
          className="ml-auto text-xs text-neutral-600"
        >
          {dateFormat.format(new Date(loadout.created_at))}
        </time>
      </div>
    </li>
  )
}

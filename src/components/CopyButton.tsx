import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'copied' | 'manual'

// 非 HTTPS 环境（如局域网 IP 访问）下 navigator.clipboard 不可用，降级为手动复制
async function writeClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 权限被拒绝时继续走降级路径
    }
  }

  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  ta.setSelectionRange(0, text.length)

  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(ta)
  return ok
}

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  function flash(next: Status) {
    setStatus(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2000)
  }

  async function handleClick() {
    const ok = await writeClipboard(text)
    flash(ok ? 'copied' : 'manual')
  }

  const label = status === 'copied' ? '已复制' : status === 'manual' ? '请长按上方码手动复制' : '复制改枪码'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`min-h-11 rounded-lg px-4 text-sm font-medium transition-colors ${
        status === 'idle'
          ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 active:bg-emerald-600'
          : 'bg-emerald-500/20 text-emerald-300'
      } ${className}`}
    >
      {label}
    </button>
  )
}

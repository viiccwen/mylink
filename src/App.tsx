import { Moon, Sun } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { FaDiscord, FaGithub, FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import { TbWorldWww } from 'react-icons/tb'

import { Button } from '@/components/ui/button'

type Theme = 'dark' | 'light'

type LinkItem = {
  label: string
  handle: string
  href: string
  icon: IconType
}

type QrCell = {
  id: string
  x: number
  y: number
}

type QrPattern = {
  size: number
  cells: QrCell[]
}

const links: readonly LinkItem[] = [
  {
    label: 'Instagram',
    handle: '@viiccwen',
    href: 'https://www.instagram.com/viiccwen/',
    icon: FaInstagram,
  },
  {
    label: 'Website',
    handle: 'vicwen.com',
    href: 'https://vicwen.com',
    icon: TbWorldWww,
  },
  {
    label: 'Startup',
    handle: 'Fearyn.ai',
    href: 'https://fearyn.com',
    icon: TbWorldWww,
  },
  {
    label: 'GitHub',
    handle: '@viiccwen',
    href: 'https://github.com/viiccwen',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    handle: 'Guan Hua Wen',
    href: 'https://www.linkedin.com/in/viiccwen/',
    icon: FaLinkedin,
  },
  {
    label: 'Discord',
    handle: 'vicwen',
    href: 'https://discord.com/users/751411358502879242',
    icon: FaDiscord,
  },
  {
    label: 'Telegram',
    handle: '@wenvic',
    href: 'https://t.me/wenvic',
    icon: FaTelegram,
  },
]

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function createQrPattern(value: string): QrPattern {
  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' })
  const size = qr.modules.size
  const cells = Array.from(qr.modules.data).flatMap((filled, index) => {
    if (!filled) return []

    const x = index % size
    const y = Math.floor(index / size)

    return [{ id: `${x}-${y}`, x, y }]
  })

  return { cells, size }
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [isQrOpen, setIsQrOpen] = useState(false)
  const qrTarget = 'https://viiccwen.social'
  const qrPattern = useMemo(() => createQrPattern(qrTarget), [qrTarget])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (!isQrOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsQrOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isQrOpen])

  const isDark = theme === 'dark'

  return (
    <main
      className={`theme-${theme} relative flex min-h-svh items-center justify-center overflow-x-hidden overflow-y-auto px-5 py-8 transition-colors duration-500 sm:px-8`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-md">
        <div className="profile-card rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <div className="reveal-item mb-2 flex justify-end [--reveal-delay:80ms]">
            <Button
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="theme-toggle"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isDark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
            </Button>
          </div>
          <header className="flex flex-col items-center text-center">
            <div className={["avatar-anchor reveal-item relative [--reveal-delay:180ms] transition-[margin] duration-500", isQrOpen ? "mb-[18.5rem]" : "mb-5"].join(' ')}>
              <div className="avatar-float relative">
                <div className="absolute inset-0 rounded-[1.7rem] bg-violet-400/30 blur-xl" />
                <button
                  aria-controls="profile-qr-popover"
                  aria-expanded={isQrOpen}
                  aria-label={isQrOpen ? 'Hide Vic Wen QR code' : 'Show Vic Wen QR code'}
                  className="avatar-button relative block rounded-[1.7rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
                  onClick={() => setIsQrOpen((current) => !current)}
                  type="button"
                >
                  <img
                    alt="Portrait of Vic Wen"
                    className="relative size-28 rounded-[1.7rem] border border-white/15 object-cover shadow-2xl shadow-black/30 transition duration-500 hover:scale-[1.03] sm:size-32"
                    height="128"
                    src="/vicwen.webp"
                    width="128"
                  />
                  <span aria-hidden="true" className="avatar-hint absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border border-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]">
                    QR
                  </span>
                </button>
              </div>
              {isQrOpen ? <QrPopover pattern={qrPattern} target={qrTarget} /> : null}
            </div>
            <h1 className="reveal-item text-3xl font-black tracking-tight text-zinc-50 [--reveal-delay:280ms] sm:text-4xl">Vic Wen</h1>
            <p className="muted-text reveal-item mt-4 max-w-sm text-sm leading-6 text-zinc-300 [--reveal-delay:360ms]">
              𝗔𝗺𝗲𝗿𝗶𝗰𝗮𝗻𝗼 | 𝗪𝗼𝗿𝗸𝗼𝘂𝘁 | 𝗠𝗶𝗰𝗿𝗼𝘀𝗼𝗳𝘁 𝗥𝗗𝗜
            </p>
          </header>

          <nav aria-label="Vic Wen links" className="mt-7 space-y-3">
            {links.map((link, index) => {
              const Icon = link.icon

              return (
                <Button
                  asChild
                  className="link-card reveal-item group h-auto w-full justify-start rounded-2xl px-4 py-3.5 text-left"
                  key={link.label}
                  style={{ '--reveal-delay': `${460 + index * 70}ms` } as CSSProperties}
                >
                  <a href={link.href} rel="noreferrer" target="_blank">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="icon-shell flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-violet-200">
                        <Icon aria-hidden="true" className="size-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-current">{link.label}</span>
                        <span className="muted-text block truncate font-mono text-xs text-zinc-400">{link.handle}</span>
                      </span>
                    </span>
                  </a>
                </Button>
              )
            })}
          </nav>
        </div>

      </section>
    </main>
  )
}

function QrPopover({ pattern, target }: { pattern: QrPattern; target: string }) {
  return (
    <div
      aria-label={`QR code for ${target}`}
      className="qr-popover absolute left-1/2 top-[calc(100%-0.4rem)] z-40 w-56 rounded-[1.65rem] border p-4 text-left shadow-2xl backdrop-blur-xl"
      id="profile-qr-popover"
      role="dialog"
    >
      <div aria-hidden="true" className="qr-stem absolute -top-3 left-1/2 size-6 -translate-x-1/2 rotate-45 rounded-md border-l border-t" />
      <div className="qr-frame relative rounded-[1.25rem] p-3 shadow-inner">
        <svg aria-hidden="true" className="qr-code block size-full" viewBox={`0 0 ${pattern.size} ${pattern.size}`}>
          <rect className="qr-bg" height={pattern.size} rx="1.6" width={pattern.size} x="0" y="0" />
          {pattern.cells.map((cell) => (
            <rect className="qr-dot" height="0.82" key={cell.id} rx="0.24" width="0.82" x={cell.x + 0.09} y={cell.y + 0.09} />
          ))}
        </svg>
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs font-semibold tracking-wide text-current">Scan my links</p>
        <p className="muted-text mt-1 truncate font-mono text-[11px]">{target.replace(/^https?:\/\//, '')}</p>
      </div>
    </div>
  )
}

export default App

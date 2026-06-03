import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
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

const links: readonly LinkItem[] = [
  {
    label: 'GitHub',
    handle: '@viiccwen',
    href: 'https://github.com/viiccwen',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    handle: 'Vic Wen',
    href: 'https://www.linkedin.com/in/viiccwen/',
    icon: FaLinkedin,
  },
  {
    label: 'Instagram',
    handle: '@viiccwen',
    href: 'https://www.instagram.com/viiccwen/',
    icon: FaInstagram,
  },
  {
    label: 'Discord',
    handle: 'vicwen',
    href: 'https://discord.com/users/vicwen',
    icon: FaDiscord,
  },
  {
    label: 'Telegram',
    handle: '@vicwen',
    href: 'https://t.me/vicwen',
    icon: FaTelegram,
  },
  {
    label: 'Website',
    handle: 'vicwen.app',
    href: 'https://vicwen.app',
    icon: TbWorldWww,
  },
]

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <main
      className={`theme-${theme} relative flex min-h-svh items-center justify-center overflow-hidden px-5 py-8 transition-colors duration-500 sm:px-8`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <div className="mb-2 flex justify-end">
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
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-[1.7rem] bg-violet-400/30 blur-xl" />
              <img
                alt="Portrait of Vic Wen"
                className="relative size-28 rounded-[1.7rem] border border-white/15 object-cover shadow-2xl shadow-black/30 sm:size-32"
                height="128"
                src="/vicwen.webp"
                width="128"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">Vic Wen</h1>
            <p className="muted-text mt-4 max-w-sm text-sm leading-6 text-zinc-300">
              𝗦𝗪𝗘 | 𝗥𝗲𝘀𝗲𝗮𝗿𝗰𝗵 | 𝗔𝗺𝗲𝗿𝗶𝗰𝗮𝗻𝗼 | 𝗪𝗼𝗿𝗸𝗼𝘂𝘁
            </p>
          </header>

          <nav aria-label="Vic Wen links" className="mt-7 space-y-3">
            {links.map((link, index) => {
              const Icon = link.icon

              return (
                <Button
                  asChild
                  className="link-card group h-auto w-full rounded-2xl px-4 py-3.5 text-left animate-in fade-in slide-in-from-bottom-2"
                  key={link.label}
                  style={{ animationDelay: `${120 + index * 45}ms` }}
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

export default App

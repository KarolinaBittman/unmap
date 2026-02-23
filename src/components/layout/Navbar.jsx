import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Map, Heart, BookOpen } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Map, label: 'Journey', path: '/journey' },
  { icon: Heart, label: 'Check-in', path: '/checkin' },
  { icon: BookOpen, label: 'Resources', path: '/resources' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile } = useUserStore()

  return (
    <>
      <header className="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between md:hidden sticky top-0 z-30">
        <h1 className="font-heading font-bold text-brand-text text-lg tracking-tight">
          unmap
        </h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-brand-muted p-1 rounded-lg hover:bg-brand-surface transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute top-[65px] left-0 right-0 bg-white border-b border-brand-border p-4 space-y-1">
            {navItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-surface text-brand-primary'
                      : 'text-brand-muted',
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-brand-border mt-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {profile.name?.[0] ?? 'U'}
                </div>
                <p className="text-sm font-medium text-brand-text">
                  {profile.name}
                </p>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

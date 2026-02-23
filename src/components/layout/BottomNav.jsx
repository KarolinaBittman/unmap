import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Heart, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Map, label: 'Journey', path: '/journey' },
  { icon: Heart, label: 'Check-in', path: '/checkin' },
  { icon: BookOpen, label: 'Resources', path: '/resources' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border px-2 pb-safe md:hidden z-30">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-3 px-4 text-xs font-medium transition-all duration-200 min-w-0',
                isActive ? 'text-brand-primary' : 'text-brand-muted',
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

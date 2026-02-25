import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Map, Heart, BookOpen, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Map, label: 'Journey', path: '/journey' },
  { icon: Heart, label: 'Check-in', path: '/checkin' },
  { icon: BookOpen, label: 'Library', path: '/resources' },
]

export default function Sidebar() {
  const { profile, journeyProgress, clearUserData } = useUserStore()
  const navigate = useNavigate()
  const initials = profile.name ? profile.name[0].toUpperCase() : 'U'

  async function handleSignOut() {
    await supabase.auth.signOut()
    clearUserData()
    navigate('/auth')
  }

  return (
    <aside className="w-64 bg-white border-r border-brand-border h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-brand-border">
        <h1 className="font-heading font-bold text-brand-text text-xl tracking-tight">
          unmap
        </h1>
        <p className="text-brand-muted text-xs mt-0.5">you make sense.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-surface text-brand-primary'
                  : 'text-brand-muted hover:bg-brand-surface/50 hover:text-brand-text',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Stage progress */}
      <div className="px-6 pb-4">
        <p className="text-xs text-brand-muted mb-2">
          {profile.currentStage > 6 ? 'All stages complete' : `Stage ${profile.currentStage} of 6`}
        </p>
        <div className="bg-brand-border rounded-full h-1.5">
          <div
            className="bg-brand-primary rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${Math.min((profile.currentStage / 6) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* User profile */}
      <div className="px-4 pt-4 pb-2 border-t border-brand-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-text truncate">
              {profile.name}
            </p>
            <p className="text-xs text-brand-muted">
              {journeyProgress}% complete
            </p>
          </div>
        </div>
      </div>

      {/* Log out — always visible at the very bottom */}
      <div className="px-4 pb-5">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-brand-muted border border-brand-border hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  )
}

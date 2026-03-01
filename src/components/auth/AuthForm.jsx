import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthForm() {
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const isSignUp = tab === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        })
        if (signUpError) throw signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-brand-surface border border-brand-border p-1 mb-6">
        {['signin', 'signup'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              tab === t
                ? 'bg-white text-brand-text shadow-sm'
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            {t === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name is fine"
              required={isSignUp}
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text text-sm placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text text-sm placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
            required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text text-sm placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-heading font-semibold text-base hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading
            ? (isSignUp ? 'Creating account…' : 'Signing in…')
            : (isSignUp ? 'Create account →' : 'Sign in →')}
        </button>
      </form>
    </div>
  )
}

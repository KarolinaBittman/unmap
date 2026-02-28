import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-brand-bg">

      {/* Animated gradient orbs — barely visible, slow drift */}
      <div
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full orb-drift-1 pointer-events-none select-none"
        style={{ background: 'radial-gradient(circle, rgba(248,181,160,0.30) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full orb-drift-2 pointer-events-none select-none"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.28) 0%, transparent 65%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[360px] h-[360px] rounded-full orb-drift-3 pointer-events-none select-none"
        style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.18) 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6">

        {/* Brand name + quote */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl text-brand-text tracking-tight">
            unmap
          </h1>
          <p className="font-emotional italic text-brand-text/55 text-sm leading-relaxed">
            "The life you want is already inside you."
          </p>
        </div>

        <AuthForm />
      </div>
    </div>
  )
}

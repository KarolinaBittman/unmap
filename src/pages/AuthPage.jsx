import AuthForm from '@/components/auth/AuthForm'
import PathBackground from '@/components/PathBackground'

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-brand-bg">

      {/* Winding path illustration — at 0% progress for unauthenticated visitors */}
      <PathBackground progress={0} />

      {/* Card sits above the illustration */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-md p-8 space-y-6" style={{ zIndex: 1 }}>

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

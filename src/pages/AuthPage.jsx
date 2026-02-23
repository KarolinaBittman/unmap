import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm mb-8 text-center">
        <h1 className="font-heading font-bold text-3xl text-brand-text tracking-tight mb-2">
          unmap
        </h1>
        <p className="text-brand-muted text-sm">You make sense.</p>
      </div>
      <AuthForm />
    </div>
  )
}

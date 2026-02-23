import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-heading font-bold text-5xl text-brand-text mb-4">
        unmap
      </h1>
      <p className="text-brand-muted text-lg mb-2">You make sense.</p>
      <p className="text-brand-muted max-w-md mb-10">
        A guided life-redesign journey — from where you are to where you want to
        be.
      </p>
      <button
        onClick={() => navigate('/onboarding')}
        className="bg-brand-primary text-white font-medium px-8 py-3 rounded-xl hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Begin your journey
      </button>
      <button
        onClick={() => navigate('/')}
        className="mt-4 text-brand-muted text-sm hover:text-brand-text transition-colors"
      >
        Already a member? Sign in
      </button>
    </div>
  )
}

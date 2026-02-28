import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import PathBackground from '@/components/PathBackground'

export default function Onboarding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <OnboardingFlow />
    </div>
  )
}

import IdentityFlow from '@/components/identity/IdentityFlow'
import PathBackground from '@/components/PathBackground'

export default function IdentityPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <IdentityFlow />
    </div>
  )
}

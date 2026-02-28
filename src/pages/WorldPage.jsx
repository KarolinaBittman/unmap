import WorldFlow from '@/components/world/WorldFlow'
import PathBackground from '@/components/PathBackground'

export default function WorldPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <WorldFlow />
    </div>
  )
}

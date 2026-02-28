import BlocksDiagnostic from '@/components/blocks/BlocksDiagnostic'
import PathBackground from '@/components/PathBackground'

export default function BlocksPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <BlocksDiagnostic />
    </div>
  )
}

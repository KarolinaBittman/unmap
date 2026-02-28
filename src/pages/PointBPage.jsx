import PointBFlow from '@/components/pointb/PointBFlow'
import PathBackground from '@/components/PathBackground'

export default function PointBPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <PointBFlow />
    </div>
  )
}

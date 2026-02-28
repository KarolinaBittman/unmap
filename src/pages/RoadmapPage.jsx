import RoadmapFlow from '@/components/roadmap/RoadmapFlow'
import PathBackground from '@/components/PathBackground'

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <RoadmapFlow />
    </div>
  )
}

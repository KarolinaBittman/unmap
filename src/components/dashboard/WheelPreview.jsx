import WheelChart from './WheelChart'

// Accepts a scores object and an optional height for sizing.
export default function WheelPreview({ scores = {}, height = 240 }) {
  return (
    <div style={{ width: height, height: height }} className="mx-auto">
      <WheelChart scores={scores} size={height} />
    </div>
  )
}

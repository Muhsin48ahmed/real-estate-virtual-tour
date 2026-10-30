import { useTour } from '../state/store'

const HINTS = {
  overview: 'Click any room to step inside · Drag to orbit · Scroll to zoom',
  room: 'Drag (or use ← →) to look around · Tap a doorway label to walk through',
} as const

export function HintBar() {
  const mode = useTour((s) => s.mode)
  return (
    <p className="hint" role="status">
      {HINTS[mode]}
    </p>
  )
}

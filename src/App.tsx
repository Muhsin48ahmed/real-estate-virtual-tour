import { useProgress } from '@react-three/drei'
import { lazy, Suspense, useState } from 'react'
import { isWebGLAvailable } from './lib/webgl'
import { useActiveRoom, useProperty } from './state/store'
import { FloorPlan } from './ui/FloorPlan'
import { HintBar } from './ui/HintBar'
import { InquiryDialog } from './ui/InquiryDialog'
import { LoadingScreen } from './ui/LoadingScreen'
import { PropertyCard } from './ui/PropertyCard'
import { RoomPanel } from './ui/RoomPanel'
import { SceneLabels } from './ui/SceneLabels'
import { TopBar } from './ui/TopBar'

const TourCanvas = lazy(() => import('./scene/TourCanvas').then((m) => ({ default: m.TourCanvas })))

function SceneFallback() {
  return (
    <div className="scene-fallback" role="status">
      <p>Your browser can’t display 3D here, but you can still explore the floor plan and enquire.</p>
    </div>
  )
}

export default function App() {
  const property = useProperty()
  const room = useActiveRoom()
  const [hasWebGL] = useState(isWebGLAvailable)
  const [isSceneReady, setSceneReady] = useState(false)
  const { active: isLoadingAssets, progress } = useProgress()
  const isTourReady = isSceneReady && !isLoadingAssets

  return (
    <div className="app">
      {hasWebGL ? (
        <Suspense fallback={null}>
          <TourCanvas onReady={() => setSceneReady(true)} />
          <SceneLabels property={property} />
        </Suspense>
      ) : (
        <SceneFallback />
      )}
      <TopBar />
      <main className="overlay">
        {room ? <RoomPanel property={property} room={room} /> : <PropertyCard property={property} />}
        <FloorPlan property={property} />
      </main>
      {hasWebGL && <HintBar />}
      <InquiryDialog />
      {hasWebGL && <LoadingScreen propertyName={property.name} isDone={isTourReady} progress={progress} />}
    </div>
  )
}

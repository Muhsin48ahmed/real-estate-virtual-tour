import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export type Quality = 'high' | 'low'

/**
 * Photographic finishing: ambient occlusion grounds furniture and darkens corners, bloom lets the
 * downlights glow, Khronos PBR Neutral tone mapping keeps material colours true, and a light vignette frames the shot.
 */
export function Effects({ quality }: { readonly quality: Quality }) {
  const isHigh = quality === 'high'
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={0.9} distanceFalloff={0.6} intensity={2.4} quality={isHigh ? 'high' : 'performance'} halfRes={!isHigh} />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={isHigh ? 0.5 : 0.3} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.32} darkness={0.42} />
      <SMAA />
    </EffectComposer>
  )
}

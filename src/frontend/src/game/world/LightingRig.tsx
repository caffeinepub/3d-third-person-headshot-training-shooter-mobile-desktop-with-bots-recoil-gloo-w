import { useQualityStore } from '../state/qualityStore';

export function LightingRig() {
  const shadowsEnabled = useQualityStore((state) => state.shadowsEnabled);
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87ceeb', '#654321', 0.3]} />
    </>
  );
}

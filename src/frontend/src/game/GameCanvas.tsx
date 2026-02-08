import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PlayerController } from './player/PlayerController';
import { ThirdPersonCameraRig } from './camera/ThirdPersonCameraRig';
import { ArenaMap } from './world/ArenaMap';
import { LightingRig } from './world/LightingRig';
import { BotManager } from './bots/BotManager';
import { ShieldWallManager } from './world/ShieldWallManager';
import { useQualityStore } from './state/qualityStore';
import { Physics } from '@react-three/cannon';

export function GameCanvas() {
  const { shadowsEnabled, pixelRatio } = useQualityStore();

  return (
    <Canvas
      shadows={shadowsEnabled}
      dpr={pixelRatio}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 2, 5], fov: 75 }}
    >
      <Suspense fallback={null}>
        <Physics gravity={[0, -20, 0]} iterations={10}>
          <LightingRig />
          <ArenaMap />
          <PlayerController />
          <ThirdPersonCameraRig />
          <BotManager />
          <ShieldWallManager />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

import { useFrame } from '@react-three/fiber';
import { useShieldStore } from '../abilities/useShieldAbility';
import { ShieldWall } from './ShieldWall';

export function ShieldWallManager() {
  const shields = useShieldStore((state) => state.shields);
  const updateCooldown = useShieldStore((state) => state.updateCooldown);
  
  useFrame((state, delta) => {
    updateCooldown(delta);
  });
  
  return (
    <>
      {shields.map((shield) => (
        <ShieldWall key={shield.id} position={shield.position} rotation={shield.rotation} />
      ))}
    </>
  );
}

import { useBox } from '@react-three/cannon';
import { Vector3 } from 'three';

interface ShieldWallProps {
  position: Vector3;
  rotation: number;
}

export function ShieldWall({ position, rotation }: ShieldWallProps) {
  const [ref] = useBox(() => ({
    position: [position.x, position.y + 1, position.z],
    rotation: [0, rotation, 0],
    args: [3, 2, 0.2],
    mass: 0
  }));
  
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[3, 2, 0.2]} />
      <meshStandardMaterial
        color="#00ffff"
        transparent
        opacity={0.6}
        emissive="#00aaaa"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

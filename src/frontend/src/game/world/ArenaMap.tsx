import { usePlane, useBox } from '@react-three/cannon';

export function ArenaMap() {
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }));
  
  return (
    <group>
      {/* Ground */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Cover obstacles */}
      <CoverBox position={[5, 0.75, 5]} />
      <CoverBox position={[-5, 0.75, 5]} />
      <CoverBox position={[5, 0.75, -5]} />
      <CoverBox position={[-5, 0.75, -5]} />
      <CoverBox position={[0, 0.75, 8]} />
      <CoverBox position={[8, 0.75, 0]} />
      <CoverBox position={[-8, 0.75, 0]} />
      <CoverBox position={[0, 0.75, -8]} />
    </group>
  );
}

function CoverBox({ position }: { position: [number, number, number] }) {
  const [ref] = useBox(() => ({
    position,
    args: [2, 1.5, 2],
    mass: 0
  }));
  
  return (
    <mesh ref={ref} castShadow receiveShadow userData={{ type: 'cover' }}>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshStandardMaterial color="#4a4a4a" />
    </mesh>
  );
}

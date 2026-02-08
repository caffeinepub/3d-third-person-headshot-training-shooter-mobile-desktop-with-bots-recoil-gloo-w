import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, Raycaster } from 'three';
import { useSphere } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '../state/gameStore';

interface BotCharacterProps {
  id: string;
  spawnPosition: [number, number, number];
}

export function BotCharacter({ id, spawnPosition }: BotCharacterProps) {
  const groupRef = useRef<Group>(null);
  const [position, setPosition] = useState(new Vector3(...spawnPosition));
  const [direction, setDirection] = useState(1);
  const time = useRef(0);
  const fireTimer = useRef(0);
  const { scene: botScene } = useGLTF('/assets/models/enemy-bot-character.glb');
  const { scene } = useThree();
  
  const [bodyRef] = useSphere(() => ({
    mass: 0,
    position: spawnPosition,
    args: [0.4]
  }));
  
  const [headRef] = useSphere(() => ({
    mass: 0,
    position: [spawnPosition[0], spawnPosition[1] + 0.8, spawnPosition[2]],
    args: [0.25]
  }));
  
  useFrame((state, delta) => {
    time.current += delta;
    fireTimer.current += delta;
    
    const newX = spawnPosition[0] + Math.sin(time.current * 0.5) * 3 * direction;
    const newZ = spawnPosition[2] + Math.cos(time.current * 0.3) * 2;
    
    setPosition(new Vector3(newX, spawnPosition[1], newZ));
    
    if (groupRef.current) {
      groupRef.current.position.set(newX, spawnPosition[1], newZ);
    }
    
    // Bot return fire logic
    if (fireTimer.current > 2.0) { // Fire every 2 seconds
      const playerPos = useGameStore.getState().playerPosition;
      const botPos = new Vector3(newX, spawnPosition[1] + 0.8, newZ);
      const distance = botPos.distanceTo(playerPos);
      
      // Only fire if player is within range (30 units)
      if (distance < 30) {
        const raycaster = new Raycaster();
        const direction = new Vector3().subVectors(playerPos, botPos).normalize();
        raycaster.set(botPos, direction);
        
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        // Check if line of sight is clear (first hit is player)
        if (intersects.length > 0) {
          const firstHit = intersects[0];
          if (firstHit.object.userData?.type === 'player' || firstHit.distance > distance - 1) {
            // Hit the player
            useGameStore.getState().takeDamage(5);
            fireTimer.current = 0;
          } else if (firstHit.object.userData?.type !== 'bot' && firstHit.object.userData?.type !== 'head' && firstHit.object.userData?.type !== 'body') {
            // Hit cover, don't fire
            fireTimer.current = 0;
          }
        }
      }
    }
  });
  
  const isMoving = true; // Bots are always moving
  
  return (
    <group ref={groupRef} userData={{ type: 'bot', id }}>
      {/* Invisible hit zones for player shooting */}
      <mesh ref={bodyRef} visible={false} userData={{ type: 'body', botId: id }}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
      
      <mesh ref={headRef} position={[0, 0.8, 0]} visible={false} userData={{ type: 'head', botId: id }}>
        <sphereGeometry args={[0.25, 16, 16]} />
      </mesh>
      
      {/* Visible bot character model */}
      <primitive 
        object={botScene.clone()} 
        scale={0.8}
        castShadow
      />
    </group>
  );
}

useGLTF.preload('/assets/models/enemy-bot-character.glb');

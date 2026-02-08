import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '../state/gameStore';
import { useDesktopControls } from '../controls/useDesktopControls';
import { useMobileControls } from '../controls/useMobileControls';
import { useWeaponSystem } from '../combat/useWeaponSystem';

export function PlayerController() {
  const [ref, api] = useSphere(() => ({
    mass: 80,
    position: [0, 2, 0],
    args: [0.5],
    fixedRotation: true
  }));
  
  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 2, 0]);
  
  const { moveForward, moveRight, playerRotation, isCrouching, isJumping } = useGameStore();
  
  useDesktopControls();
  useMobileControls();
  useWeaponSystem();
  
  useEffect(() => {
    const unsubVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubPos = api.position.subscribe((p) => {
      position.current = p;
      useGameStore.setState({ playerPosition: new Vector3(...p) });
    });
    return () => {
      unsubVel();
      unsubPos();
    };
  }, [api]);
  
  useFrame(() => {
    const speed = isCrouching ? 2 : 4;
    const direction = new Vector3();
    
    const forward = new Vector3(
      Math.sin(playerRotation),
      0,
      Math.cos(playerRotation)
    );
    const right = new Vector3(
      Math.cos(playerRotation),
      0,
      -Math.sin(playerRotation)
    );
    
    direction.add(forward.multiplyScalar(moveForward));
    direction.add(right.multiplyScalar(moveRight));
    
    if (direction.length() > 0) {
      direction.normalize().multiplyScalar(speed);
    }
    
    api.velocity.set(direction.x, velocity.current[1], direction.z);
    
    if (isJumping && Math.abs(velocity.current[1]) < 0.1) {
      api.velocity.set(velocity.current[0], 8, velocity.current[2]);
      useGameStore.setState({ isJumping: false });
    }
  });
  
  const isMoving = Math.abs(moveForward) > 0.1 || Math.abs(moveRight) > 0.1;
  
  return (
    <group>
      {/* Invisible physics collider */}
      <mesh ref={ref} visible={false} userData={{ type: 'player' }}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      
      {/* Visible character model */}
      <PlayerCharacterModel isMoving={isMoving} />
    </group>
  );
}

function PlayerCharacterModel({ isMoving }: { isMoving: boolean }) {
  const { scene } = useGLTF('/assets/models/player-character.glb');
  const modelRef = useRef<any>(null);
  
  useFrame(() => {
    if (modelRef.current) {
      const { playerPosition, playerRotation } = useGameStore.getState();
      modelRef.current.position.copy(playerPosition);
      modelRef.current.position.y -= 0.5; // Adjust to ground level
      modelRef.current.rotation.y = -playerRotation;
    }
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      scale={0.8}
      castShadow
    />
  );
}

useGLTF.preload('/assets/models/player-character.glb');

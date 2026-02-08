import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, PerspectiveCamera } from 'three';
import { useGameStore } from '../state/gameStore';

export function ThirdPersonCameraRig() {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const currentPosition = useRef(new Vector3());
  
  useFrame(() => {
    const { playerPosition, playerRotation, lookY, isADS, isCrouching } = useGameStore.getState();
    
    const distance = isADS ? 1.5 : 3;
    const height = isCrouching ? 1.2 : 1.8;
    
    targetPosition.current.set(
      playerPosition.x - Math.sin(playerRotation) * distance,
      playerPosition.y + height + lookY * 2,
      playerPosition.z - Math.cos(playerRotation) * distance
    );
    
    currentPosition.current.lerp(targetPosition.current, 0.1);
    camera.position.copy(currentPosition.current);
    
    const lookTarget = new Vector3(
      playerPosition.x + Math.sin(playerRotation) * 10,
      playerPosition.y + height + lookY * 10,
      playerPosition.z + Math.cos(playerRotation) * 10
    );
    
    camera.lookAt(lookTarget);
    
    // Type guard to check if camera is PerspectiveCamera
    if (camera instanceof PerspectiveCamera) {
      if (isADS) {
        camera.fov = 50;
      } else {
        camera.fov = 75;
      }
      camera.updateProjectionMatrix();
    }
  });
  
  return null;
}

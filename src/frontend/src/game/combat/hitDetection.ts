import { Raycaster, Vector2, Camera, Scene } from 'three';
import { useGameStore } from '../state/gameStore';
import { AudioManager } from '../audio/AudioManager';

const raycaster = new Raycaster();
const screenCenter = new Vector2(0, 0);

export function checkHit(camera: Camera, scene: Scene) {
  raycaster.setFromCamera(screenCenter, camera);
  
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  for (const intersect of intersects) {
    const userData = intersect.object.userData;
    
    if (userData.type === 'head') {
      useGameStore.getState().addScore(100, true);
      AudioManager.playHeadshot();
      return;
    } else if (userData.type === 'body') {
      useGameStore.getState().addScore(25, false);
      return;
    }
  }
}

import { Vector3, Camera, Scene, Raycaster, Vector2 } from 'three';

export class AimAssistSystem {
  private raycaster = new Raycaster();
  private screenCenter = new Vector2(0, 0);
  
  applyAimAssist(camera: Camera, scene: Scene, currentRotation: number, currentLookY: number): { rotation: number; lookY: number } {
    this.raycaster.setFromCamera(this.screenCenter, camera);
    
    const intersects = this.raycaster.intersectObjects(scene.children, true);
    
    for (const intersect of intersects) {
      const userData = intersect.object.userData;
      
      if (userData.type === 'head' || userData.type === 'body') {
        const targetPos = intersect.point;
        const cameraPos = camera.position;
        
        const direction = new Vector3().subVectors(targetPos, cameraPos).normalize();
        const targetRotation = Math.atan2(direction.x, direction.z);
        const targetLookY = Math.asin(direction.y);
        
        const assistStrength = 0.05;
        
        return {
          rotation: currentRotation + (targetRotation - currentRotation) * assistStrength,
          lookY: currentLookY + (targetLookY - currentLookY) * assistStrength
        };
      }
    }
    
    return { rotation: currentRotation, lookY: currentLookY };
  }
}

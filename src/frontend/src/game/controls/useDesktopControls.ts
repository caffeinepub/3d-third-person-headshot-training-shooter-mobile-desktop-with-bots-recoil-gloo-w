import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { useShieldAbility } from '../abilities/useShieldAbility';

export function useDesktopControls() {
  const { deployShield } = useShieldAbility();
  
  useEffect(() => {
    const keys: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      
      // Movement
      const forward = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
      const right = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
      useGameStore.getState().setMovement(forward, right);
      
      // Actions
      if (e.code === 'Space') {
        useGameStore.setState({ isJumping: true });
      }
      if (e.code === 'KeyC' || e.code === 'ControlLeft') {
        useGameStore.setState({ isCrouching: true });
      }
      if (e.code === 'KeyE') {
        deployShield();
      }
      if (e.code === 'KeyR') {
        useGameStore.getState().reload();
      }
      
      // Weapon switching
      if (e.code === 'Digit1') {
        useGameStore.getState().switchWeapon('rifle');
      }
      if (e.code === 'Digit2') {
        useGameStore.getState().switchWeapon('smg');
      }
      if (e.code === 'KeyQ') {
        useGameStore.getState().cycleWeapon();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
      
      const forward = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
      const right = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
      useGameStore.getState().setMovement(forward, right);
      
      if (e.code === 'KeyC' || e.code === 'ControlLeft') {
        useGameStore.setState({ isCrouching: false });
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        useGameStore.setState({ isFiring: true });
      }
      if (e.button === 2) {
        useGameStore.setState({ isADS: true });
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        useGameStore.setState({ isFiring: false });
      }
      if (e.button === 2) {
        useGameStore.setState({ isADS: false });
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        const { sensitivity, adsSensitivity } = useSettingsStore.getState();
        const { isADS, playerRotation, lookY } = useGameStore.getState();
        const sens = isADS ? adsSensitivity : sensitivity;
        
        const newRotation = playerRotation - e.movementX * 0.002 * sens;
        const newLookY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, lookY - e.movementY * 0.002 * sens));
        
        useGameStore.setState({ 
          playerRotation: newRotation,
          lookY: newLookY
        });
      }
    };
    
    const handleClick = () => {
      document.body.requestPointerLock();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [deployShield]);
}

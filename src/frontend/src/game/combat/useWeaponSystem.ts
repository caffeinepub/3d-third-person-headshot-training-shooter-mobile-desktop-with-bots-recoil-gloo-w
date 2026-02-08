import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore, WEAPONS } from '../state/gameStore';
import { checkHit } from './hitDetection';
import { AudioManager } from '../audio/AudioManager';
import { RecoilSystem } from './RecoilSystem';

export function useWeaponSystem() {
  const fireRateRef = useRef(0);
  const recoilSystem = useRef(new RecoilSystem());
  
  useFrame((state, delta) => {
    const { isFiring, currentAmmo, isReloading, isADS, currentWeapon } = useGameStore.getState();
    const weapon = WEAPONS[currentWeapon];
    
    fireRateRef.current -= delta;
    
    if (isFiring && currentAmmo > 0 && !isReloading && fireRateRef.current <= 0) {
      fireRateRef.current = weapon.fireRate;
      
      useGameStore.getState().fireShot();
      AudioManager.playGunshot();
      
      const recoil = recoilSystem.current.applyRecoil(isADS, weapon.recoilIntensity);
      const { lookY, playerRotation } = useGameStore.getState();
      useGameStore.setState({
        lookY: lookY + recoil.vertical,
        playerRotation: playerRotation + recoil.horizontal
      });
      
      checkHit(state.camera, state.scene);
    }
    
    recoilSystem.current.update(delta);
  });
}

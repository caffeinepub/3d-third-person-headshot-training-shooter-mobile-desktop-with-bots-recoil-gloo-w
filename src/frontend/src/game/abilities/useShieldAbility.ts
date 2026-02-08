import { create } from 'zustand';
import { useGameStore } from '../state/gameStore';
import { Vector3 } from 'three';

interface ShieldState {
  shields: Array<{ id: string; position: Vector3; rotation: number }>;
  cooldown: number;
  maxCooldown: number;
  addShield: (position: Vector3, rotation: number) => void;
  updateCooldown: (delta: number) => void;
}

export const useShieldStore = create<ShieldState>((set) => ({
  shields: [],
  cooldown: 0,
  maxCooldown: 10,
  
  addShield: (position, rotation) => set((state) => ({
    shields: [...state.shields, { id: Date.now().toString(), position, rotation }],
    cooldown: state.maxCooldown
  })),
  
  updateCooldown: (delta) => set((state) => ({
    cooldown: Math.max(0, state.cooldown - delta)
  }))
}));

export function useShieldAbility() {
  const deployShield = () => {
    const { cooldown, addShield } = useShieldStore.getState();
    
    if (cooldown > 0) return;
    
    const { playerPosition, playerRotation } = useGameStore.getState();
    const offset = new Vector3(
      Math.sin(playerRotation) * 2,
      0,
      Math.cos(playerRotation) * 2
    );
    
    addShield(playerPosition.clone().add(offset), playerRotation);
  };
  
  return { deployShield };
}

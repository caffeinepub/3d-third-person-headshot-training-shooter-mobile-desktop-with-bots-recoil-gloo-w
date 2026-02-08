import { create } from 'zustand';
import { Vector3 } from 'three';

export interface WeaponDefinition {
  id: string;
  name: string;
  fireRate: number; // seconds between shots
  maxAmmo: number;
  recoilIntensity: number; // multiplier for recoil
  modelPath: string;
}

export const WEAPONS: Record<string, WeaponDefinition> = {
  rifle: {
    id: 'rifle',
    name: 'Rifle',
    fireRate: 0.1, // 10 rounds per second
    maxAmmo: 30,
    recoilIntensity: 1.0,
    modelPath: '/assets/models/weapons/rifle.glb'
  },
  smg: {
    id: 'smg',
    name: 'SMG',
    fireRate: 0.06, // ~16 rounds per second
    maxAmmo: 40,
    recoilIntensity: 0.7,
    modelPath: '/assets/models/weapons/smg.glb'
  }
};

interface GameState {
  isInitialized: boolean;
  
  // Player state
  playerPosition: Vector3;
  playerRotation: number;
  playerVelocity: Vector3;
  isJumping: boolean;
  isCrouching: boolean;
  isADS: boolean;
  
  // Player health
  currentHealth: number;
  maxHealth: number;
  
  // Movement input
  moveForward: number;
  moveRight: number;
  lookX: number;
  lookY: number;
  
  // Combat state
  isFiring: boolean;
  currentWeapon: string; // weapon id
  currentAmmo: number;
  isReloading: boolean;
  
  // Score tracking
  score: number;
  headshots: number;
  totalShots: number;
  
  // Actions
  setPlayerPosition: (pos: Vector3) => void;
  setPlayerRotation: (rot: number) => void;
  setMovement: (forward: number, right: number) => void;
  setLook: (x: number, y: number) => void;
  setJumping: (jumping: boolean) => void;
  setCrouching: (crouching: boolean) => void;
  setADS: (ads: boolean) => void;
  setFiring: (firing: boolean) => void;
  switchWeapon: (weaponId: string) => void;
  cycleWeapon: () => void;
  fireShot: () => void;
  reload: () => void;
  takeDamage: (amount: number) => void;
  addScore: (points: number, isHeadshot: boolean) => void;
  resetScore: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  isInitialized: false,
  
  playerPosition: new Vector3(0, 1, 0),
  playerRotation: 0,
  playerVelocity: new Vector3(0, 0, 0),
  isJumping: false,
  isCrouching: false,
  isADS: false,
  
  currentHealth: 100,
  maxHealth: 100,
  
  moveForward: 0,
  moveRight: 0,
  lookX: 0,
  lookY: 0,
  
  isFiring: false,
  currentWeapon: 'rifle',
  currentAmmo: 30,
  isReloading: false,
  
  score: 0,
  headshots: 0,
  totalShots: 0,
  
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  setMovement: (forward, right) => set({ moveForward: forward, moveRight: right }),
  setLook: (x, y) => set({ lookX: x, lookY: y }),
  setJumping: (jumping) => set({ isJumping: jumping }),
  setCrouching: (crouching) => set({ isCrouching: crouching }),
  setADS: (ads) => set({ isADS: ads }),
  setFiring: (firing) => set({ isFiring: firing }),
  
  switchWeapon: (weaponId) => {
    const weapon = WEAPONS[weaponId];
    if (weapon && !get().isReloading) {
      set({ 
        currentWeapon: weaponId,
        currentAmmo: weapon.maxAmmo
      });
    }
  },
  
  cycleWeapon: () => {
    const weaponIds = Object.keys(WEAPONS);
    const currentIndex = weaponIds.indexOf(get().currentWeapon);
    const nextIndex = (currentIndex + 1) % weaponIds.length;
    get().switchWeapon(weaponIds[nextIndex]);
  },
  
  fireShot: () => set((state) => {
    if (state.currentAmmo > 0 && !state.isReloading) {
      return { 
        currentAmmo: state.currentAmmo - 1,
        totalShots: state.totalShots + 1
      };
    }
    return state;
  }),
  
  reload: () => set((state) => {
    const weapon = WEAPONS[state.currentWeapon];
    if (!state.isReloading && state.currentAmmo < weapon.maxAmmo) {
      setTimeout(() => {
        const currentWeapon = get().currentWeapon;
        const weapon = WEAPONS[currentWeapon];
        set({ currentAmmo: weapon.maxAmmo, isReloading: false });
      }, 1500);
      return { isReloading: true };
    }
    return state;
  }),
  
  takeDamage: (amount) => set((state) => ({
    currentHealth: Math.max(0, state.currentHealth - amount)
  })),
  
  addScore: (points, isHeadshot) => set((state) => ({
    score: state.score + points,
    headshots: state.headshots + (isHeadshot ? 1 : 0)
  })),
  
  resetScore: () => set({ score: 0, headshots: 0, totalShots: 0 })
}));

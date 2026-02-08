import { create } from 'zustand';

interface QualityState {
  shadowsEnabled: boolean;
  pixelRatio: number;
  preset: 'low' | 'medium' | 'high';
  
  setPreset: (preset: 'low' | 'medium' | 'high') => void;
  toggleShadows: () => void;
}

export const useQualityStore = create<QualityState>((set) => ({
  shadowsEnabled: true,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  preset: 'medium',
  
  setPreset: (preset) => set(() => {
    switch (preset) {
      case 'low':
        return {
          preset,
          shadowsEnabled: false,
          pixelRatio: 1
        };
      case 'medium':
        return {
          preset,
          shadowsEnabled: true,
          pixelRatio: Math.min(window.devicePixelRatio, 1.5)
        };
      case 'high':
        return {
          preset,
          shadowsEnabled: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        };
    }
  }),
  
  toggleShadows: () => set((state) => ({ shadowsEnabled: !state.shadowsEnabled }))
}));

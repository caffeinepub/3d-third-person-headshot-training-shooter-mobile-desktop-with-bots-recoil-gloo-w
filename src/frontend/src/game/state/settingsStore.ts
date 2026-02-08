import { create } from 'zustand';
import type { PlayerSettings } from '../../backend';

interface SettingsState extends PlayerSettings {
  adsSensitivity: number;
  applySettings: (settings: Partial<PlayerSettings>) => void;
  updateSetting: <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  aimAssistEnabled: true,
  sensitivity: 1.0,
  audioVolume: 0.5,
  qualitySettings: 'medium',
  adsSensitivity: 0.5,
  
  applySettings: (settings) => set((state) => ({ ...state, ...settings })),
  
  updateSetting: (key, value) => set((state) => ({ ...state, [key]: value }))
}));

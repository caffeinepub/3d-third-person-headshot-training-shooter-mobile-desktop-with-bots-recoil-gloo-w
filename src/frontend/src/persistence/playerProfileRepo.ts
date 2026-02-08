import type { PlayerProfile, PlayerSettings, ScoreRecord } from '../backend';

const STORAGE_KEY = 'shooter_player_profile';

export const playerProfileRepo = {
  loadLocal(): PlayerProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },
  
  saveLocal(profile: PlayerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile locally:', error);
    }
  },
  
  clearLocal(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear local profile:', error);
    }
  }
};

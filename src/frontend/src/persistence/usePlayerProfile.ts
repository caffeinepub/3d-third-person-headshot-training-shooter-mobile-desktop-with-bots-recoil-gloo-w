import { useCallback, useState, useEffect } from 'react';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { playerProfileRepo } from './playerProfileRepo';
import { useGameStore } from '../game/state/gameStore';
import { useSettingsStore } from '../game/state/settingsStore';
import type { PlayerProfile, PlayerSettings, ScoreRecord } from '../backend';

export function usePlayerProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [bestScore, setBestScore] = useState(0);
  const [bestHeadshots, setBestHeadshots] = useState(0);
  
  const isAuthenticated = !!identity;
  
  const loadProfile = useCallback(async (): Promise<PlayerProfile | null> => {
    if (isAuthenticated && actor) {
      try {
        const profile = await actor.getPlayerProfile();
        setBestScore(Number(profile.bestScore.score));
        setBestHeadshots(Number(profile.bestScore.headshots));
        return profile;
      } catch (error) {
        console.error('Failed to load profile from backend:', error);
      }
    }
    
    const localProfile = playerProfileRepo.loadLocal();
    if (localProfile) {
      setBestScore(Number(localProfile.bestScore.score));
      setBestHeadshots(Number(localProfile.bestScore.headshots));
    }
    return localProfile;
  }, [actor, isAuthenticated]);
  
  const saveSettings = useCallback(async (settings: PlayerSettings) => {
    if (isAuthenticated && actor) {
      try {
        await actor.savePlayerSettings(settings);
      } catch (error) {
        console.error('Failed to save settings to backend:', error);
      }
    }
    
    const currentProfile = playerProfileRepo.loadLocal() || {
      settings,
      bestScore: { score: BigInt(0), headshots: BigInt(0) }
    };
    
    playerProfileRepo.saveLocal({
      ...currentProfile,
      settings
    });
  }, [actor, isAuthenticated]);
  
  const updateBestScore = useCallback(async (score: number, headshots: number) => {
    const newScore: ScoreRecord = {
      score: BigInt(score),
      headshots: BigInt(headshots)
    };
    
    if (isAuthenticated && actor) {
      try {
        await actor.updateBestScore(newScore);
        const profile = await actor.getPlayerProfile();
        setBestScore(Number(profile.bestScore.score));
        setBestHeadshots(Number(profile.bestScore.headshots));
      } catch (error) {
        console.error('Failed to update best score on backend:', error);
      }
    }
    
    const currentProfile = playerProfileRepo.loadLocal();
    if (!currentProfile || score > Number(currentProfile.bestScore.score)) {
      const updatedProfile: PlayerProfile = {
        settings: currentProfile?.settings || useSettingsStore.getState(),
        bestScore: newScore
      };
      playerProfileRepo.saveLocal(updatedProfile);
      setBestScore(score);
      setBestHeadshots(headshots);
    }
  }, [actor, isAuthenticated]);
  
  useEffect(() => {
    const settings = useSettingsStore.getState();
    const unsubscribe = useSettingsStore.subscribe((state) => {
      const debounceTimer = setTimeout(() => {
        saveSettings(state);
      }, 1000);
      return () => clearTimeout(debounceTimer);
    });
    
    return unsubscribe;
  }, [saveSettings]);
  
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      if (state.score > bestScore) {
        updateBestScore(state.score, state.headshots);
      }
    });
    
    return unsubscribe;
  }, [bestScore, updateBestScore]);
  
  return {
    loadProfile,
    saveSettings,
    updateBestScore,
    bestScore,
    bestHeadshots
  };
}

import { useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { HUD } from '../hud/HUD';
import { usePlayerProfile } from '../persistence/usePlayerProfile';
import { useGameStore } from './state/gameStore';
import { useSettingsStore } from './state/settingsStore';

export function GameScreen() {
  const { loadProfile } = usePlayerProfile();
  const { applySettings } = useSettingsStore();
  const isInitialized = useGameStore((state) => state.isInitialized);

  useEffect(() => {
    const init = async () => {
      const profile = await loadProfile();
      if (profile) {
        applySettings(profile.settings);
      }
      useGameStore.setState({ isInitialized: true });
    };
    init();
  }, [loadProfile, applySettings]);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <GameCanvas />
      <HUD />
    </div>
  );
}

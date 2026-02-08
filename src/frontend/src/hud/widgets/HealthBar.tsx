import { useGameStore } from '../../game/state/gameStore';

export function HealthBar() {
  const currentHealth = useGameStore((state) => state.currentHealth);
  const maxHealth = useGameStore((state) => state.maxHealth);
  
  const healthPercentage = (currentHealth / maxHealth) * 100;
  
  return (
    <div className="pointer-events-none absolute left-4 top-4">
      <div className="rounded-lg bg-black/60 px-4 py-2 backdrop-blur-sm">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">Health</div>
        <div className="h-3 w-32 overflow-hidden rounded-full bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300" 
            style={{ width: `${healthPercentage}%` }} 
          />
        </div>
        <div className="mt-1 text-xs text-white/80">{currentHealth} / {maxHealth}</div>
      </div>
    </div>
  );
}

import { useGameStore, WEAPONS } from '../../game/state/gameStore';

export function AmmoCounter() {
  const currentAmmo = useGameStore((state) => state.currentAmmo);
  const currentWeapon = useGameStore((state) => state.currentWeapon);
  const isReloading = useGameStore((state) => state.isReloading);
  
  const weapon = WEAPONS[currentWeapon];
  
  return (
    <div className="pointer-events-none absolute bottom-4 right-4">
      <div className="rounded-lg bg-black/60 px-6 py-3 backdrop-blur-sm">
        <div className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-white/70">
          {weapon.name}
        </div>
        <div className="text-center">
          {isReloading ? (
            <div className="text-2xl font-bold text-yellow-400">RELOADING...</div>
          ) : (
            <>
              <div className="text-4xl font-bold text-white">{currentAmmo}</div>
              <div className="text-sm text-white/60">/ {weapon.maxAmmo}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

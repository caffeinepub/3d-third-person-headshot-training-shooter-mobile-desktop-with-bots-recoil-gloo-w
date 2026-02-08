import { useShieldAbility, useShieldStore } from '../../game/abilities/useShieldAbility';

export function ShieldButton() {
  const { deployShield } = useShieldAbility();
  const cooldown = useShieldStore((state) => state.cooldown);
  const maxCooldown = useShieldStore((state) => state.maxCooldown);
  
  const isOnCooldown = cooldown > 0;
  const cooldownPercent = (cooldown / maxCooldown) * 100;
  
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        deployShield();
      }}
      onClick={deployShield}
      disabled={isOnCooldown}
      className="relative h-16 w-16 rounded-full bg-cyan-600 text-xs font-bold text-white shadow-lg transition-all hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50"
    >
      Shield
      {isOnCooldown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="10"
              strokeDasharray={`${283 - (283 * cooldownPercent) / 100} 283`}
            />
          </svg>
        </div>
      )}
    </button>
  );
}

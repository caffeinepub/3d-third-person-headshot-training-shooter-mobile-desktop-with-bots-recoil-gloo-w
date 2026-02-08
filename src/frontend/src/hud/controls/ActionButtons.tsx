import { useGameStore } from '../../game/state/gameStore';
import { useShieldAbility } from '../../game/abilities/useShieldAbility';
import { ShieldButton } from './ShieldButton';

export function ActionButtons() {
  const setFiring = useGameStore((state) => state.setFiring);
  const setADS = useGameStore((state) => state.setADS);
  const setJumping = useGameStore((state) => state.setJumping);
  const setCrouching = useGameStore((state) => state.setCrouching);
  const reload = useGameStore((state) => state.reload);
  const cycleWeapon = useGameStore((state) => state.cycleWeapon);
  
  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 flex flex-col gap-4">
      {/* Top row - Primary actions */}
      <div className="flex justify-end gap-4">
        <ActionButton
          label="Fire"
          onTouchStart={() => setFiring(true)}
          onTouchEnd={() => setFiring(false)}
          color="red"
        />
        <ActionButton
          label="ADS"
          onTouchStart={() => setADS(true)}
          onTouchEnd={() => setADS(false)}
          color="blue"
        />
      </div>
      
      {/* Middle row - Movement actions */}
      <div className="flex justify-end gap-4">
        <ActionButton
          label="Jump"
          onTouchStart={() => setJumping(true)}
          color="green"
        />
        <ActionButton
          label="Crouch"
          onTouchStart={() => setCrouching(true)}
          onTouchEnd={() => setCrouching(false)}
          color="yellow"
        />
      </div>
      
      {/* Bottom row - Utility actions */}
      <div className="flex justify-end gap-4">
        <ActionButton
          label="Weapon"
          onTouchStart={() => cycleWeapon()}
          color="orange"
        />
        <ActionButton
          label="Reload"
          onTouchStart={() => reload()}
          color="purple"
        />
        <ShieldButton />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  onTouchStart: () => void;
  onTouchEnd?: () => void;
  color: string;
}

function ActionButton({ label, onTouchStart, onTouchEnd, color }: ActionButtonProps) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
    blue: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    green: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800',
    purple: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
    cyan: 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800',
    orange: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
  };
  
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onTouchStart();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onTouchEnd?.();
      }}
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      className={`h-16 w-16 rounded-full text-xs font-bold text-white shadow-lg transition-all ${colorMap[color]}`}
    >
      {label}
    </button>
  );
}

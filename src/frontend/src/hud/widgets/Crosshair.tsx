import { useGameStore } from '../../game/state/gameStore';

export function Crosshair() {
  const isADS = useGameStore((state) => state.isADS);
  
  let crosshairImage;
  try {
    crosshairImage = '/assets/generated/crosshair-set.dim_256x256.png';
  } catch {
    crosshairImage = null;
  }
  
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {crosshairImage ? (
        <img
          src={crosshairImage}
          alt="Crosshair"
          className="transition-all duration-200"
          style={{
            width: isADS ? '24px' : '32px',
            height: isADS ? '24px' : '32px',
            opacity: 0.8
          }}
        />
      ) : (
        <div className="relative h-8 w-8">
          <div className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 bg-white opacity-80" />
          <div className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white opacity-80" />
        </div>
      )}
    </div>
  );
}

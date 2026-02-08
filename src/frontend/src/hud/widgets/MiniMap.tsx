import { useGameStore } from '../../game/state/gameStore';

export function MiniMap() {
  const playerRotation = useGameStore((state) => state.playerRotation);
  
  let frameImage;
  try {
    frameImage = '/assets/generated/minimap-frame.dim_512x512.png';
  } catch {
    frameImage = null;
  }
  
  return (
    <div className="pointer-events-none absolute left-4 top-20">
      <div className="relative h-32 w-32 rounded-lg bg-black/60 backdrop-blur-sm">
        {frameImage && (
          <img src={frameImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-3 w-3 rounded-full bg-blue-500"
            style={{
              transform: `rotate(${-playerRotation}rad)`
            }}
          >
            <div className="h-1 w-1 translate-x-1 translate-y-1 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

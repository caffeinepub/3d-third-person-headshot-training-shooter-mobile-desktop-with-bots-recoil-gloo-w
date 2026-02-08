import { useGameStore } from '../../game/state/gameStore';

export function ScorePanel() {
  const score = useGameStore((state) => state.score);
  const headshots = useGameStore((state) => state.headshots);
  
  return (
    <div className="pointer-events-none absolute right-4 top-4">
      <div className="rounded-lg bg-black/60 px-4 py-3 backdrop-blur-sm">
        <div className="mb-2 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Score</div>
          <div className="text-2xl font-bold text-yellow-400">{score}</div>
        </div>
        <div className="border-t border-white/20 pt-2 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Headshots</div>
          <div className="text-xl font-bold text-red-400">{headshots}</div>
        </div>
      </div>
    </div>
  );
}

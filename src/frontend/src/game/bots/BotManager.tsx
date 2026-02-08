import { BotCharacter } from './BotCharacter';

export function BotManager() {
  return (
    <group>
      <BotCharacter id="bot1" spawnPosition={[10, 1, 0]} />
      <BotCharacter id="bot2" spawnPosition={[-10, 1, 0]} />
      <BotCharacter id="bot3" spawnPosition={[0, 1, 10]} />
    </group>
  );
}

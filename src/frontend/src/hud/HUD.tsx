import { HUDLayout } from './layout/HUDLayout';
import { HealthBar } from './widgets/HealthBar';
import { AmmoCounter } from './widgets/AmmoCounter';
import { ScorePanel } from './widgets/ScorePanel';
import { MiniMap } from './widgets/MiniMap';
import { Crosshair } from './widgets/Crosshair';
import { ActionButtons } from './controls/ActionButtons';
import { VirtualStick } from './controls/VirtualStick';
import { SettingsButton } from './controls/SettingsButton';

export function HUD() {
  return (
    <HUDLayout>
      <HealthBar />
      <AmmoCounter />
      <ScorePanel />
      <MiniMap />
      <Crosshair />
      <ActionButtons />
      <VirtualStick />
      <SettingsButton />
    </HUDLayout>
  );
}

import { useSettingsStore } from '../game/state/settingsStore';
import { useQualityStore } from '../game/state/qualityStore';
import { usePlayerProfile } from '../persistence/usePlayerProfile';
import { AuthControls } from './AuthControls';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const settings = useSettingsStore();
  const quality = useQualityStore();
  const { bestScore, bestHeadshots } = usePlayerProfile();
  
  if (!isOpen) return null;
  
  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="mb-6 text-3xl font-bold text-white">Settings</h2>
        
        <div className="space-y-6">
          {/* Best Records */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-yellow-400">Best Records</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-white/60">Best Score</div>
                <div className="text-2xl font-bold text-white">{bestScore}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Best Headshots</div>
                <div className="text-2xl font-bold text-red-400">{bestHeadshots}</div>
              </div>
            </div>
          </div>
          
          {/* Aim Settings */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">Aim Settings</h3>
            
            <div className="mb-4 flex items-center justify-between">
              <label className="text-white">Aim Assist</label>
              <button
                onClick={() => settings.updateSetting('aimAssistEnabled', !settings.aimAssistEnabled)}
                className={`relative h-6 w-12 rounded-full transition-colors ${
                  settings.aimAssistEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.aimAssistEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="mb-2 block text-white">Sensitivity: {settings.sensitivity.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => settings.updateSetting('sensitivity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-white">ADS Sensitivity: {settings.adsSensitivity.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={settings.adsSensitivity}
                onChange={(e) => useSettingsStore.setState({ adsSensitivity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Audio Settings */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">Audio</h3>
            <div>
              <label className="mb-2 block text-white">Volume: {Math.round(settings.audioVolume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.audioVolume}
                onChange={(e) => settings.updateSetting('audioVolume', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Quality Settings */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">Graphics Quality</h3>
            
            <div className="mb-4 flex gap-2">
              {(['low', 'medium', 'high'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => quality.setPreset(preset)}
                  className={`flex-1 rounded-lg px-4 py-2 font-semibold capitalize transition-colors ${
                    quality.preset === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-white/70 hover:bg-gray-600'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white">Shadows</label>
                <button
                  onClick={quality.toggleShadows}
                  className={`relative h-6 w-12 rounded-full transition-colors ${
                    quality.shadowsEnabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      quality.shadowsEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* Authentication */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">Account</h3>
            <AuthControls />
          </div>
        </div>
      </div>
    </div>
  );
}

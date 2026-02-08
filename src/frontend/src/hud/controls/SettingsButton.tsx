import { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsPanel } from '../../ui/SettingsPanel';

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto absolute right-4 top-32 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
      >
        <Settings className="h-6 w-6" />
      </button>
      
      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

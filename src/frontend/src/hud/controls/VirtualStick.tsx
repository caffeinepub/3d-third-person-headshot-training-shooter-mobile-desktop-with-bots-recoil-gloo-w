import { useRef, useEffect } from 'react';
import { useGameStore } from '../../game/state/gameStore';

export function VirtualStick() {
  const stickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  
  useEffect(() => {
    const stick = stickRef.current;
    if (!stick) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (activeTouch.current !== null) return;
      
      const touch = e.touches[0];
      activeTouch.current = touch.identifier;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (activeTouch.current === null) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouch.current);
      if (!touch || !stick || !knobRef.current) return;
      
      const rect = stick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2;
      
      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);
      
      const knobX = Math.cos(angle) * clampedDistance;
      const knobY = Math.sin(angle) * clampedDistance;
      
      knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
      
      const normalizedX = knobX / maxDistance;
      const normalizedY = knobY / maxDistance;
      
      useGameStore.getState().setMovement(-normalizedY, normalizedX);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touches = Array.from(e.changedTouches);
      if (touches.some(t => t.identifier === activeTouch.current)) {
        activeTouch.current = null;
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(0, 0)';
        }
        useGameStore.getState().setMovement(0, 0);
      }
    };
    
    stick.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      stick.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4">
      <div
        ref={stickRef}
        className="relative h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm"
      >
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 transition-transform"
        />
      </div>
    </div>
  );
}

import { ReactNode } from 'react';

interface HUDLayoutProps {
  children: ReactNode;
}

export function HUDLayout({ children }: HUDLayoutProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {children}
    </div>
  );
}

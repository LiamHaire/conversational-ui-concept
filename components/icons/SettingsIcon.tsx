import { Gear } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function SettingsIcon({ size = 24, className = '' }: Props) {
  return <Gear size={size} className={className} />;
}

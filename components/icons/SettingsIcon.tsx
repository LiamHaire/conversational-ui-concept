import { Settings } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SettingsIcon({ size = 24, className = '' }: Props) {
  return <Settings size={size} className={className} />;
}

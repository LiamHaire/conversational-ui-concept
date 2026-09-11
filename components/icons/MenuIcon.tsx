import { Menu } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function MenuIcon({ size = 24, className = '' }: Props) {
  return <Menu size={size} className={className} />;
}

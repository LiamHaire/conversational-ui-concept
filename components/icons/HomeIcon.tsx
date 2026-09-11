import { Home } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function HomeIcon({ size = 24, className = '' }: Props) {
  return <Home size={size} className={className} />;
}

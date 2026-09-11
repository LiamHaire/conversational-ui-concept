import { Globe } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function GlobeIcon({ size = 24, className = '' }: Props) {
  return <Globe size={size} className={className} />;
}

import { Check } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function TickIcon({ size = 24, className = '' }: Props) {
  return <Check size={size} className={className} />;
}

import { Check } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function TickIcon({ size = 24, className = '' }: Props) {
  return <Check size={size} className={className} />;
}

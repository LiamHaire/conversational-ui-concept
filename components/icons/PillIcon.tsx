import { Pill } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function PillIcon({ size = 24, className = '' }: Props) {
  return <Pill size={size} className={className} />;
}

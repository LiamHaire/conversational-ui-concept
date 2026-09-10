import { CaretDown } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ChevronDownIcon({ size = 24, className = '' }: Props) {
  return <CaretDown size={size} className={className} />;
}

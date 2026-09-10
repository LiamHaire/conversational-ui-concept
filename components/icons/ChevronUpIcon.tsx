import { CaretUp } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ChevronUpIcon({ size = 24, className = '' }: Props) {
  return <CaretUp size={size} className={className} />;
}

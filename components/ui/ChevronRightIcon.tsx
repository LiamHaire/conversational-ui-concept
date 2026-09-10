import { CaretRight } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ChevronRightIcon({ size = 16, className = '' }: Props) {
  return <CaretRight size={size} className={className} />;
}

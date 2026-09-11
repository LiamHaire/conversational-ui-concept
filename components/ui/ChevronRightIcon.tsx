import { ChevronRight } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ChevronRightIcon({ size = 16, className = '' }: Props) {
  return <ChevronRight size={size} className={className} />;
}

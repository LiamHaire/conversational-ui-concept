import { ChevronUp } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ChevronUpIcon({ size = 24, className = '' }: Props) {
  return <ChevronUp size={size} className={className} />;
}

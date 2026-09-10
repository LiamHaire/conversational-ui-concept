import { ArrowsLeftRight } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function SwapHorizontalIcon({ size = 24, className = '' }: Props) {
  return <ArrowsLeftRight size={size} className={className} />;
}

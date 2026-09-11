import { Swap } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SwapHorizontalIcon({ size = 24, className = '' }: Props) {
  return <Swap size={size} className={className} />;
}

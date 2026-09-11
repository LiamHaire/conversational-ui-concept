import { Recurring } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function RepeatIcon({ size = 24, className = '' }: Props) {
  return <Recurring size={size} className={className} />;
}

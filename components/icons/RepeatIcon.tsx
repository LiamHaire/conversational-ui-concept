import { ArrowCounterClockwise } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function RepeatIcon({ size = 24, className = '' }: Props) {
  return <ArrowCounterClockwise size={size} className={className} />;
}

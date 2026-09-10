import { ClockCounterClockwise } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ChatHistoryIcon({ size = 24, className = '' }: Props) {
  return <ClockCounterClockwise size={size} className={className} />;
}

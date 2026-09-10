import { Calendar } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function CalendarIcon({ size = 24, className = '' }: Props) {
  return <Calendar size={size} className={className} />;
}

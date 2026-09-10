import { CalendarCheck } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function AppointmentIcon({ size = 24, className = '' }: Props) {
  return <CalendarCheck size={size} className={className} />;
}

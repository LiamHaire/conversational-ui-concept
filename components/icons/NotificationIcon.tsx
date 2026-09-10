import { Bell } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function NotificationIcon({ size = 24, className = '' }: Props) {
  return <Bell size={size} className={className} />;
}

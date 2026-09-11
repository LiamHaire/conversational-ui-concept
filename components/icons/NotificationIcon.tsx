import { Notifications } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function NotificationIcon({ size = 24, className = '' }: Props) {
  return <Notifications size={size} className={className} />;
}

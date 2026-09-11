import { MoreVertical } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function MoreVerticalIcon({ size = 24, className = '' }: Props) {
  return <MoreVertical size={size} className={className} />;
}

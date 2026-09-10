import { DotsThreeVertical } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function MoreVerticalIcon({ size = 24, className = '' }: Props) {
  return <DotsThreeVertical size={size} className={className} />;
}

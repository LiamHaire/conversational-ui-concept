import { PencilSimple } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function EditIcon({ size = 24, className = '' }: Props) {
  return <PencilSimple size={size} className={className} />;
}

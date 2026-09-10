import { Plus } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function PlusIcon({ size = 24, className = '' }: Props) {
  return <Plus size={size} className={className} />;
}

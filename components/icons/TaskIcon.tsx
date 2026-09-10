import { CheckSquare } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function TaskIcon({ size = 24, className = '' }: Props) {
  return <CheckSquare size={size} className={className} />;
}

import { CheckSquare } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function TaskListIcon({ size = 24, className = '' }: Props) {
  return <CheckSquare size={size} className={className} />;
}

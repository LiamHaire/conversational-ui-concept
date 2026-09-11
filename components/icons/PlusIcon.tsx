import { Add } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function PlusIcon({ size = 24, className = '' }: Props) {
  return <Add size={size} className={className} />;
}

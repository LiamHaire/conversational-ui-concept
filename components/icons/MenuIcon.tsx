import { List } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function MenuIcon({ size = 24, className = '' }: Props) {
  return <List size={size} className={className} />;
}

import { MagnifyingGlass } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function SearchIcon({ size = 24, className = '' }: Props) {
  return <MagnifyingGlass size={size} className={className} />;
}

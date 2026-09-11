import { Search } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SearchIcon({ size = 24, className = '' }: Props) {
  return <Search size={size} className={className} />;
}

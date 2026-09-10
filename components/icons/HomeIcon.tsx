import { House } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function HomeIcon({ size = 24, className = '' }: Props) {
  return <House size={size} className={className} />;
}

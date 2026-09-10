import { ThumbsDown } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ThumbsDownIcon({ size = 24, className = '' }: Props) {
  return <ThumbsDown size={size} className={className} />;
}

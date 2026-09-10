import { ThumbsUp } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ThumbsUpIcon({ size = 24, className = '' }: Props) {
  return <ThumbsUp size={size} className={className} />;
}

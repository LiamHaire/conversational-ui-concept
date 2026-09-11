import { IconThumbsDown } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ThumbsDownIcon({ size = 24, className = '' }: Props) {
  return <IconThumbsDown size={size} className={className} />;
}

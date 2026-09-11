import { IconThumbsUp } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ThumbsUpIcon({ size = 24, className = '' }: Props) {
  return <IconThumbsUp size={size} className={className} />;
}

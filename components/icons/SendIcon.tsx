import { PaperPlaneRight } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function SendIcon({ size = 24, className = '' }: Props) {
  return <PaperPlaneRight size={size} className={className} />;
}

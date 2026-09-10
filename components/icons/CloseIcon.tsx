import { X } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function CloseIcon({ size = 24, className = '' }: Props) {
  return <X size={size} className={className} />;
}

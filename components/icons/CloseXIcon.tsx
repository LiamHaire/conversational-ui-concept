import { Close } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function CloseXIcon({ size = 24, className = '' }: Props) {
  return <Close size={size} className={className} />;
}

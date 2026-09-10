import { Envelope } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function ReferralIcon({ size = 24, className = '' }: Props) {
  return <Envelope size={size} className={className} />;
}

import { User } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function PatientIcon({ size = 24, className = '' }: Props) {
  return <User size={size} className={className} />;
}

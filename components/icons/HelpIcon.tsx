import { Question } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function HelpIcon({ size = 24, className = '' }: Props) {
  return <Question size={size} className={className} />;
}

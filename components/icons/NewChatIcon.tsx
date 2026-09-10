import { PlusCircle } from '@phosphor-icons/react';

interface Props { size?: number; className?: string; }
export function NewChatIcon({ size = 24, className = '' }: Props) {
  return <PlusCircle size={size} className={className} />;
}

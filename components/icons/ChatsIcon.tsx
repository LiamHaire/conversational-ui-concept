import { Chat } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function ChatsIcon({ size = 24, className = '' }: Props) {
  return <Chat size={size} className={className} />;
}

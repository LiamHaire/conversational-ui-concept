import { ChatNew } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function NewChatIcon({ size = 24, className = '' }: Props) {
  return <ChatNew size={size} className={className} />;
}

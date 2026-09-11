import { CommunicationsSend } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function SendIcon({ size = 24, className = '' }: Props) {
  return <CommunicationsSend size={size} className={className} />;
}

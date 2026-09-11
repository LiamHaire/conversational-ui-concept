import { Microphone } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function MicIcon({ size = 24, className = '' }: Props) {
  return <Microphone size={size} className={className} />;
}

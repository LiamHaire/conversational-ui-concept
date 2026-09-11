import { IconHelp } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function HelpIcon({ size = 24, className = '' }: Props) {
  return <IconHelp size={size} className={className} />;
}

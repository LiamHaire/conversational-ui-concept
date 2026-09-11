import { Edit } from 'iqons-react';

interface Props { size?: number; className?: string; }
export function EditIcon({ size = 24, className = '' }: Props) {
  return <Edit size={size} className={className} />;
}

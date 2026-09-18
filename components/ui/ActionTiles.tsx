/**
 * ActionTiles Component
 *
 * Displays action items requiring user attention in tile format.
 * Each tile shows an icon, count, and description.
 */

'use client';

import { motion } from 'framer-motion';
import { AppointmentIcon, ReportIcon } from '@/components/icons';

interface ActionTile {
  id: string;
  type: 'appointment' | 'report';
  count: number;
  label: string;
}

interface ActionTilesProps {
  tiles?: ActionTile[];
  className?: string;
  onTileClick?: (tile: ActionTile) => void;
}

const DEFAULT_TILES: ActionTile[] = [
  { id: '2', type: 'appointment', count: 8, label: 'appointments today' },
  { id: '3', type: 'report', count: 4, label: 'reports scheduled for today' },
];

export function ActionTiles({ tiles = DEFAULT_TILES, className = '', onTileClick }: ActionTilesProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {tiles.map((tile) => (
        <ActionTile key={tile.id} tile={tile} onClick={onTileClick} />
      ))}
    </div>
  );
}

interface ActionTileProps {
  tile: ActionTile;
  onClick?: (tile: ActionTile) => void;
}

function ActionTile({ tile, onClick }: ActionTileProps) {
  const Icon = tile.type === 'appointment' ? AppointmentIcon : ReportIcon;

  const handleClick = () => {
    if (onClick) {
      onClick(tile);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative flex items-center gap-2.5 px-4 py-3.5 bg-accent1-contrast border border-accent1-light rounded-lg cursor-pointer transition-colors duration-200 overflow-hidden group"
      style={{ boxSizing: 'border-box' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ backgroundColor: 'rgba(71, 43, 46, 0.08)' }}
      />
      {/* Active/Selected overlay */}
      <div
        className="absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none"
        style={{ backgroundColor: 'rgba(71, 43, 46, 0.15)' }}
      />
      <Icon size={20} className="text-accent1-main flex-shrink-0 relative z-10" />
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className="text-sm font-semibold text-accent1-main">{tile.count}</span>
        <span className="text-sm text-accent1-main font-normal">{tile.label}</span>
      </div>
    </motion.div>
  );
}

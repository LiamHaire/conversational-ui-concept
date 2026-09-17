'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Download, TaskNew, Share } from 'iqons-react';

interface FileCardProps {
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  fileDate?: string;
  className?: string;
}

function Tooltip({ label }: { label: string }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium bg-text-primary text-background rounded whitespace-nowrap pointer-events-none z-10"
      >
        {label}
      </motion.div>
    </AnimatePresence>
  );
}

export function FileCard({
  fileName = 'Document.pdf',
  fileType = 'PDF Document',
  fileSize = '2.4 MB',
  fileDate = 'Modified today',
  className = '',
}: FileCardProps) {
  const [hoveredAction, setHoveredAction] = useState<'download' | 'add-to-task' | 'share' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border border-accent1-main bg-accent1-contrast rounded-lg p-4 flex items-center gap-4 ${className}`}
    >
      {/* File icon */}
      <div className="w-10 h-10 flex items-center justify-center bg-accent1-contrast border border-accent1-main rounded flex-shrink-0">
        <Document size={20} className="text-accent1-main" />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-accent1-dark truncate">{fileName}</div>
        <div className="text-sm text-accent1-main flex items-center gap-2 flex-wrap">
          <span>{fileType}</span>
          <span className="opacity-50">•</span>
          <span>{fileSize}</span>
          <span className="opacity-50">•</span>
          <span>{fileDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Download */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredAction('download')}
          onMouseLeave={() => setHoveredAction(null)}
        >
          {hoveredAction === 'download' && <Tooltip label="Download" />}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-accent1-main hover:bg-accent1-main/10 transition-colors cursor-pointer"
            onClick={() => {}}
            aria-label="Download"
          >
            <Download size={18} />
          </button>
        </div>

        {/* Add to Task */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredAction('add-to-task')}
          onMouseLeave={() => setHoveredAction(null)}
        >
          {hoveredAction === 'add-to-task' && <Tooltip label="Add to Task" />}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-accent1-main hover:bg-accent1-main/10 transition-colors cursor-pointer"
            onClick={() => {}}
            aria-label="Add to Task"
          >
            <TaskNew size={18} />
          </button>
        </div>

        {/* Share */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredAction('share')}
          onMouseLeave={() => setHoveredAction(null)}
        >
          {hoveredAction === 'share' && <Tooltip label="Share" />}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-accent1-main hover:bg-accent1-main/10 transition-colors cursor-pointer"
            onClick={() => {}}
            aria-label="Share"
          >
            <Share size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

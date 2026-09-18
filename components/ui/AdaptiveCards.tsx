'use client';

import { motion } from 'framer-motion';

// Action tile specific cards
export { AppointmentListCard } from './AdaptiveCards/AppointmentListCard';
export { ReportListCard } from './AdaptiveCards/ReportListCard';
export { ReopenPromptCard } from './AdaptiveCards/ReopenPromptCard';
export { PatientCard } from './AdaptiveCards/PatientCard';
export { LineGraphCard } from './AdaptiveCards/LineGraphCard';
export { FileCard } from './AdaptiveCards/FileCard';

// Base skeleton animation
const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Common component props
interface CardProps {
  className?: string;
}

// Layout 1: List Item Card with checkbox, text lines, and action buttons
export function ListItemCard({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg p-4 flex items-center gap-4 ${className}`}>
      {/* Checkbox */}
      <div className="w-6 h-6 border-2 border-border rounded flex-shrink-0" />

      {/* Content area */}
      <div className="flex-1 space-y-2">
        {/* Short title line */}
        <div className="h-4 w-32 bg-primary-light rounded" />
        {/* Long description line */}
        <div className="h-3 w-full bg-primary-light rounded" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <div className="w-8 h-8 border border-border rounded" />
        <div className="w-8 h-8 border border-border rounded" />
      </div>
    </div>
  );
}

// Layout 2: Three Column Grid (filled blocks)
export function ThreeColumnGrid({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      <div className="aspect-video bg-primary-light rounded-lg" />
      <div className="aspect-video bg-primary-light rounded-lg" />
      <div className="aspect-video bg-primary-light rounded-lg" />
    </div>
  );
}

// Layout 3: Two Column Layout (outline boxes)
export function TwoColumnLayout({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="border border-border bg-background rounded-lg p-6 h-48" />
      <div className="border border-border bg-background rounded-lg p-6 h-48" />
    </div>
  );
}

// Layout 4: Media Card (image + metadata + actions + content)
export function MediaCard({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg overflow-hidden ${className}`}>
      {/* Header with image and metadata */}
      <div className="p-4 flex gap-4 items-start">
        {/* Image/Avatar */}
        <div className="w-16 h-16 bg-primary-light rounded flex-shrink-0" />

        {/* Metadata */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-primary-light rounded" />
          <div className="h-3 w-48 bg-primary-light rounded" />
          <div className="h-3 w-full bg-primary-light rounded" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <div className="w-8 h-8 border border-border rounded" />
          <div className="w-8 h-8 border border-border rounded" />
        </div>
      </div>

      {/* Content area */}
      <div className="border-t border-border p-4">
        <div className="h-24 w-full border border-border bg-background rounded" />
      </div>
    </div>
  );
}

// Layout 5: Stats Grid (4 columns with numbers)
export function StatsGrid({ className = '' }: CardProps) {
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-border bg-background rounded-lg p-4 space-y-2">
          <div className="h-3 w-12 bg-primary-light rounded" />
          <div className="h-8 w-16 bg-primary-light rounded" />
        </div>
      ))}
    </div>
  );
}

// Layout 6: Timeline/List with avatars
export function TimelineList({ className = '' }: CardProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border bg-background rounded-lg p-4 flex gap-3 items-center">
          <div className="w-10 h-10 bg-primary-light rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-primary-light rounded" />
            <div className="h-3 w-full bg-primary-light rounded" />
          </div>
          <div className="h-3 w-16 bg-primary-light rounded flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// Layout 7: Calendar/Schedule Grid
export function CalendarGrid({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="h-8 flex items-center justify-center">
            <div className="h-3 w-3 bg-primary-light rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square border border-border rounded" />
        ))}
      </div>
    </div>
  );
}

// Layout 8: Profile Card
export function ProfileCard({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-primary-light rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-primary-light rounded" />
          <div className="h-3 w-48 bg-primary-light rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-primary-light rounded" />
        <div className="h-3 w-5/6 bg-primary-light rounded" />
        <div className="h-3 w-4/6 bg-primary-light rounded" />
      </div>
    </div>
  );
}

// Layout 9: Data Table Row
export function TableRow({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg p-4 ${className}`}>
      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="h-4 w-full bg-primary-light rounded" />
        <div className="h-4 w-full bg-primary-light rounded" />
        <div className="h-4 w-full bg-primary-light rounded" />
        <div className="h-4 w-full bg-primary-light rounded" />
        <div className="flex gap-2 justify-end">
          <div className="w-8 h-8 border border-border rounded" />
          <div className="w-8 h-8 border border-border rounded" />
        </div>
      </div>
    </div>
  );
}

// Layout 10: Form Card
export function FormCard({ className = '' }: CardProps) {
  return (
    <div className={`border border-border bg-background rounded-lg p-6 space-y-4 ${className}`}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-primary-light rounded" />
          <div className="h-10 w-full border border-border rounded" />
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        <div className="h-10 w-24 bg-primary-light rounded" />
        <div className="h-10 w-24 border border-border rounded" />
      </div>
    </div>
  );
}

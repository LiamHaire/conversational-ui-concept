/**
 * Large Adaptive Cards Component
 *
 * Skeleton layouts for large data returns displayed in the 2/3 panel.
 * Uses border-border for outlines and bg-primary-light for filled content.
 * Includes: table view, dashboard widgets, and document layouts.
 */

'use client';

export { PatientSummaryCard, PatientHeader } from './LargeAdaptiveCards/PatientSummaryCard';
export { PatientDataTableCard } from './LargeAdaptiveCards/PatientDataTableCard';

interface CardProps {
  className?: string;
}

/**
 * List View Layout - Matches Frame 524 reference
 * Checkbox list with two-line items and action buttons
 */
export function TableCard({ className = '' }: CardProps) {
  return (
    <div className={`${className}`}>
      {/* List Items - Matching reference layout */}
      <div className="space-y-3">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-4 flex items-center gap-4">
            {/* Checkbox */}
            <div className="w-5 h-5 border-2 border-border rounded flex-shrink-0" />

            {/* Content - Two lines */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-primary-light rounded" />
              <div className="h-3 w-full max-w-md bg-primary-light rounded opacity-70" />
            </div>

            {/* Action buttons on right */}
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-8 h-8 border border-border rounded" />
              <div className="w-8 h-8 border border-border rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Dashboard Layout - 3 columns of widget cards
 */
export function DashboardCard({ className = '' }: CardProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* First Row - 3 stat widgets */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border bg-background-soft rounded-lg p-4">
            <div className="h-3 w-20 bg-primary-light rounded mb-3 opacity-60" />
            <div className="h-8 w-24 bg-primary-light rounded mb-2" />
            <div className="h-2 w-16 bg-primary-light rounded opacity-40" />
          </div>
        ))}
      </div>

      {/* Second Row - 2 larger widgets */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-border bg-background-soft rounded-lg p-4">
            <div className="h-4 w-32 bg-primary-light rounded mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-12 h-12 border border-border rounded" />
                  <div className="flex-1">
                    <div className="h-3 w-full max-w-[160px] bg-primary-light rounded mb-2" />
                    <div className="h-2 w-full max-w-[120px] bg-primary-light rounded opacity-60" />
                  </div>
                  <div className="h-3 w-12 bg-primary-light rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Third Row - Full width chart widget */}
      <div className="border border-border bg-background-soft rounded-lg p-4">
        <div className="h-4 w-40 bg-primary-light rounded mb-4" />
        <div className="h-64 border border-border rounded flex items-end gap-2 p-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-light rounded"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>

      {/* Fourth Row - Additional widgets for height */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border bg-background-soft rounded-lg p-4">
            <div className="h-4 w-28 bg-primary-light rounded mb-3" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-primary-light rounded" />
              <div className="h-3 w-4/5 bg-primary-light rounded opacity-80" />
              <div className="h-3 w-3/5 bg-primary-light rounded opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Document Layout - 3 column text document
 */
export function DocumentCard({ className = '' }: CardProps) {
  return (
    <div className={`${className}`}>
      {/* 3 Column Content - More content to fill space */}
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, colIndex) => (
          <div key={colIndex} className="space-y-6">
            {/* Column Header */}
            <div className="h-4 w-32 bg-primary-light rounded mb-3" />

            {/* Paragraphs - More to fill height */}
            {[...Array(6)].map((_, paraIndex) => (
              <div key={paraIndex} className="space-y-2">
                <div className="h-3 w-full bg-primary-light rounded" />
                <div className="h-3 w-full bg-primary-light rounded" />
                <div className="h-3 w-full bg-primary-light rounded" />
                <div className="h-3 w-full bg-primary-light rounded" />
                <div className="h-3 w-4/5 bg-primary-light rounded opacity-80" />
              </div>
            ))}

            {/* Section Divider */}
            {colIndex < 2 && (
              <div className="h-px bg-border my-4 opacity-30" />
            )}
          </div>
        ))}
      </div>

      {/* Document Footer */}
      <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
        <div className="flex gap-3">
          <div className="w-8 h-8 border border-border rounded" />
          <div className="w-8 h-8 border border-border rounded" />
          <div className="w-8 h-8 border border-border rounded" />
        </div>
        <div className="h-3 w-32 bg-primary-light rounded opacity-60" />
      </div>
    </div>
  );
}

/**
 * Calendar/Timeline Layout - Event scheduling view
 */
export function CalendarCard({ className = '' }: CardProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={`${className}`}>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center p-2 bg-background-soft border border-border rounded">
            <div className="h-3 w-8 bg-primary-light rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="aspect-square border border-border bg-background-soft rounded-lg p-2">
            <div className="h-3 w-6 bg-primary-light rounded mb-2" />
            {Math.random() > 0.6 && (
              <div className="space-y-1">
                <div className="h-2 w-full bg-primary-light rounded opacity-70" />
                {Math.random() > 0.5 && (
                  <div className="h-2 w-3/4 bg-primary-light rounded opacity-50" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Events List */}
      <div className="mt-6 border-t border-border pt-6">
        <div className="h-4 w-32 bg-primary-light rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-border bg-background-soft rounded-lg">
              <div className="w-12 h-12 border border-border rounded" />
              <div className="flex-1">
                <div className="h-3 w-48 bg-primary-light rounded mb-2" />
                <div className="h-2 w-32 bg-primary-light rounded opacity-60" />
              </div>
              <div className="h-3 w-20 bg-primary-light rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Kanban Board Layout - Task management view
 */
export function KanbanCard({ className = '' }: CardProps) {
  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  return (
    <div className={`${className}`}>
      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="space-y-3">
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 bg-background-soft border border-border rounded-lg">
              <div className="h-3 w-20 bg-primary-light rounded" />
              <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
                <div className="h-2 w-2 bg-background rounded-full" />
              </div>
            </div>

            {/* Cards in Column */}
            <div className="space-y-3">
              {[...Array(Math.floor(Math.random() * 3) + 3)].map((_, cardIndex) => (
                <div key={cardIndex} className="p-3 bg-background-soft border border-border rounded-lg">
                  <div className="h-3 w-full bg-primary-light rounded mb-2" />
                  <div className="h-2 w-4/5 bg-primary-light rounded mb-3 opacity-70" />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded-full border border-border" />
                      <div className="w-5 h-5 rounded-full border border-border" />
                    </div>
                    <div className="h-2 w-12 bg-primary-light rounded opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Analytics Chart Layout - Data visualization focus
 */
export function AnalyticsCard({ className = '' }: CardProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-background-soft border border-border rounded-lg">
            <div className="h-3 w-20 bg-primary-light rounded mb-2 opacity-60" />
            <div className="h-7 w-28 bg-primary-light rounded mb-2" />
            <div className="h-2 w-16 bg-primary-light rounded opacity-40" />
          </div>
        ))}
      </div>

      {/* Large Line Chart */}
      <div className="p-4 bg-background-soft border border-border rounded-lg">
        <div className="h-4 w-32 bg-primary-light rounded mb-4" />
        <div className="h-64 border border-border rounded relative overflow-hidden p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2 w-6 bg-primary-light rounded opacity-40" />
            ))}
          </div>
          {/* Line chart area */}
          <div className="ml-8 h-full flex items-end gap-1">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="flex-1 flex items-end">
                <div
                  className="w-full bg-primary-light rounded-t opacity-70"
                  style={{ height: `${Math.random() * 90 + 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two comparison charts */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 bg-background-soft border border-border rounded-lg">
            <div className="h-4 w-28 bg-primary-light rounded mb-4" />
            <div className="h-40 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary-light opacity-30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Gallery Layout - Matches Frame 562 reference
 * Large image blocks with detail panel
 */
export function GridCard({ className = '' }: CardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Row - 3 large image blocks */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="aspect-video bg-primary-light rounded-lg opacity-30" />
        ))}
      </div>

      {/* Large detail panel */}
      <div className="border border-border rounded-lg p-6 h-80">
        <div className="h-5 w-48 bg-primary-light rounded mb-4" />
        <div className="space-y-3">
          <div className="h-3 w-full bg-primary-light rounded opacity-60" />
          <div className="h-3 w-5/6 bg-primary-light rounded opacity-60" />
          <div className="h-3 w-4/6 bg-primary-light rounded opacity-60" />
        </div>
      </div>

      {/* Bottom Row - 3 more blocks (one partial) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="aspect-video bg-primary-light rounded-lg opacity-30" />
        <div className="aspect-video bg-primary-light rounded-lg opacity-30" />
        <div className="aspect-video border border-border rounded-lg" />
      </div>
    </div>
  );
}

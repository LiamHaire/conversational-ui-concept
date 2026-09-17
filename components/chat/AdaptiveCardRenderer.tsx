'use client';

import { motion } from 'framer-motion';
import {
  ListItemCard,
  ThreeColumnGrid,
  TwoColumnLayout,
  MediaCard,
  StatsGrid,
  TimelineList,
  CalendarGrid,
  ProfileCard,
  TableRow,
  FormCard,
  TaskListCard,
  AppointmentListCard,
  ReportListCard,
  ReopenPromptCard,
  PatientCard,
  LineGraphCard,
  FileCard,
} from '@/components/ui/AdaptiveCards';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface AdaptiveCardRendererProps {
  layouts: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  className?: string;
  onReopen?: () => void;
}

// Map layout types to components
const cardComponents: Record<string, React.ComponentType<any>> = {
  'list-item': ListItemCard,
  'three-column': ThreeColumnGrid,
  'two-column': TwoColumnLayout,
  media: MediaCard,
  stats: StatsGrid,
  timeline: TimelineList,
  calendar: CalendarGrid,
  profile: ProfileCard,
  table: TableRow,
  form: FormCard,
  'task-list': TaskListCard,
  'appointment-list': AppointmentListCard,
  'report-list': ReportListCard,
  'reopen-prompt': ReopenPromptCard,
  'patient-card': PatientCard,
  'line-graph': LineGraphCard,
  'file-card': FileCard,
};

export function AdaptiveCardRenderer({
  layouts,
  className = '',
  onReopen,
}: AdaptiveCardRendererProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {layouts.map((layout, index) => {
        // Handle both string layouts and object layouts with data
        const layoutType = typeof layout === 'string' ? layout : layout.type;
        const layoutData = typeof layout === 'object' && 'data' in layout ? layout.data : undefined;
        const layoutKey = typeof layout === 'string' ? layout : layout.id || layout.type;

        const CardComponent = cardComponents[layoutType];

        if (!CardComponent) {
          console.warn(`Unknown card layout type: ${layoutType}`);
          return null;
        }

        // Pass onReopen handler to ReopenPromptCard
        const componentProps = layoutType === 'reopen-prompt'
          ? { ...layoutData, onReopen }
          : layoutData;

        return (
          <motion.div
            key={`${layoutKey}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <CardComponent {...componentProps} />
          </motion.div>
        );
      })}
    </div>
  );
}

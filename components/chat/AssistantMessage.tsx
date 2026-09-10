/**
 * AssistantMessage Component
 *
 * Displays assistant messages with IQ chat icon.
 * Supports loading state with "Working on it..." indicator.
 * Renders adaptive cards for small data returns.
 */

import { motion } from 'framer-motion';
import { IQChatIcon, BrandMarkAIIcon } from '@/components/icons';
import { ThinkingText } from './ThinkingText';
import { AdaptiveCardRenderer } from './AdaptiveCardRenderer';
import { MessageToolbar } from './MessageToolbar';
import { GameOptions } from './GameOptions';
import { SuggestedActions } from './SuggestedActions';
import { InDialogForm, TextInput, TextArea, Select } from '@/components/forms';
import type { CardLayoutType } from '@/lib/adaptiveCardSelector';

interface AssistantMessageProps {
  content?: string;
  isLoading?: boolean;
  adaptiveCards?: Array<CardLayoutType | { id: string; type: string; data?: any }>;
  gameOptions?: { id: string; text: string; nextNode: string }[];
  onSelectGameOption?: (option: { id: string; text: string; nextNode: string }) => void;
  suggestedActions?: { id: string; text: string }[];
  onSelectSuggestedAction?: (action: { id: string; text: string }) => void;
  onReopenLargeData?: () => void;
  followUpText?: string;
  timestamp?: Date;
  onCopy?: () => void;
  onEdit?: () => void;
  onRepeat?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  // Form props
  showInDialogForm?: boolean;
  formData?: {
    title: string;
    subtitle?: string;
    formId?: string;
  };
  onFormSubmit?: (formData: FormData) => void;
  onFormCancel?: () => void;
}

export function AssistantMessage({
  content,
  isLoading,
  adaptiveCards,
  gameOptions,
  onSelectGameOption,
  suggestedActions,
  onSelectSuggestedAction,
  onReopenLargeData,
  followUpText,
  timestamp,
  onCopy,
  onEdit,
  onRepeat,
  onThumbsUp,
  onThumbsDown,
  showInDialogForm,
  formData,
  onFormSubmit,
  onFormCancel,
}: AssistantMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        /* Loading State */
        <ThinkingText />
      ) : (
        /* Normal Message - Text content edge-to-edge without icon */
        <div>
          {/* Text content - flush to edge */}
          {content && (
            <div className="mb-4">
              <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
                {content}
              </div>
            </div>
          )}

          {/* Adaptive Cards - Full width, 16px below text */}
          {adaptiveCards && adaptiveCards.length > 0 && (
            <div className="mb-5">
              <AdaptiveCardRenderer layouts={adaptiveCards} onReopen={onReopenLargeData} />
            </div>
          )}

          {/* In-Dialog Form - Inline form in conversation */}
          {showInDialogForm && formData && (
            <div className="mb-5">
              <InDialogForm
                title={formData.title}
                subtitle={formData.subtitle}
                formId={formData.formId}
                submitText="Submit"
                cancelText="Cancel"
                onSubmit={onFormSubmit}
                onCancel={onFormCancel}
              >
                {/* Example form fields - replace with dynamic fields */}
                <TextInput
                  label="Patient Name"
                  name="patient_name"
                  placeholder="Enter patient name"
                  required
                />
                <TextInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  required
                />
                <Select
                  label="Gender"
                  name="gender"
                  placeholder="Select gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  required
                />
                <TextArea
                  label="Notes"
                  name="notes"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </InDialogForm>
            </div>
          )}

          {/* Follow-up Text - Additional context after cards but before actions */}
          {followUpText && (
            <div className="mb-5">
              <div className="text-text-primary text-sm leading-6 whitespace-pre-wrap">
                {followUpText}
              </div>
            </div>
          )}

          {/* Game Options - Interactive choices for text adventure */}
          {gameOptions && gameOptions.length > 0 && onSelectGameOption && (
            <div className="mb-3">
              <GameOptions
                options={gameOptions}
                onSelectOption={onSelectGameOption}
              />
            </div>
          )}

          {/* Suggested Actions - Follow-up actions after data returns */}
          {suggestedActions && suggestedActions.length > 0 && onSelectSuggestedAction && (
            <div className="mb-3">
              <SuggestedActions
                actions={suggestedActions}
                onSelectAction={onSelectSuggestedAction}
              />
            </div>
          )}

          {/* Message Toolbar - Full width with actions */}
          <MessageToolbar
            onCopy={onCopy}
            onEdit={onEdit}
            onRepeat={onRepeat}
            onThumbsUp={onThumbsUp}
            onThumbsDown={onThumbsDown}
          />
        </div>
      )}
    </motion.div>
  );
}

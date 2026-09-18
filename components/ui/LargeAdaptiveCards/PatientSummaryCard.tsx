/**
 * PatientSummaryCard Component
 *
 * Large data view showing patient summary with enhanced patient header and widget grid.
 * Widget content is populated by the AI summarization agent via /api/summarize-patient.
 */

'use client';

import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { PatientIcon, MoreVerticalIcon, ArrowRightIcon, ReferralIcon, PillIcon, CalendarIcon } from '@/components/icons';
import { ChevronRightIcon } from '@/components/ui/ChevronRightIcon';
import { ACTIVE_PATIENT, PATIENT_HARPER, PATIENT_ELLISON, PATIENT_OKAFOR, type Patient } from '@/lib/patientData';
import { calcComplexity, calcRisk } from '@/lib/clinicalCalculators';
import { PatientEntryTile } from '@/components/ui/PatientEntryTile';
import { AllergyChip, type AllergyStatus } from '@/components/ui/AllergyChip';
import { RiskStatusChip, type RiskLevel } from '@/components/ui/RiskStatusChip';
import { LifestyleMetricTile, SparkDialog, type MetricHistoryPoint } from '@/components/ui/LifestyleMetricTile';
import { TestGroupTile } from '@/components/ui/RecentTestTile';
import { ActivityTimeline } from '@/components/ui/ActivityTimeline';

function getAllergyStatus(allergyText: string): AllergyStatus {
  const lower = allergyText.toLowerCase();
  if (lower.includes('unavailable') || lower.includes('unknown')) return 'unavailable';
  if (lower.includes('not recorded') || lower.includes('no record')) return 'not-recorded';
  if (lower.includes('no known')) return 'none';
  return 'known';
}

const PATIENT_REGISTRY: Record<string, Patient> = {
  'PT-10001': PATIENT_HARPER,
  'PT-10002': PATIENT_ELLISON,
  'PT-10003': PATIENT_OKAFOR,
};

interface PatientSummaryCardProps {
  patientName?: string;
  dateOfBirth?: string;
  patientId?: string;
  sex?: string;
  allergyStatus?: string;
  onWidgetClick?: (widgetTitle: string) => void;
  showWidgets?: boolean;
  className?: string;
  activePatientId?: string;
  careMode?: 'primary' | 'urgent';
}

const SUMMARY_WIDGET = { id: 'summary', title: 'Summary' };
const STACK_WIDGETS_PRIMARY = [
  { id: 'encounters', title: 'Recent encounters' },
  { id: 'medications', title: 'Current medications' },
  { id: 'tests', title: 'Recent tests' },
];
const STACK_WIDGETS_URGENT = [
  { id: 'medications', title: 'Current medications' },
  { id: 'encounters', title: 'Recent encounters' },
  { id: 'immunisations', title: 'Immunisations' },
  { id: 'referrals', title: 'Primary care outbound referrals' },
];

// Separate Patient Header component for reuse
export function PatientHeader({
  patientName = ACTIVE_PATIENT.demographics.displayName,
  dateOfBirth = ACTIVE_PATIENT.demographics.dateOfBirth,
  patientId = ACTIVE_PATIENT.demographics.patientId,
  sex = ACTIVE_PATIENT.demographics.sex,
  allergyStatus = ACTIVE_PATIENT.demographics.allergies,
  className = '',
  activePatientId,
}: Omit<PatientSummaryCardProps, 'onWidgetClick' | 'showWidgets'>) {
  const resolved = activePatientId ? PATIENT_REGISTRY[activePatientId] : null;
  let patientIdType: 'CHI' | 'NHS' | undefined;
  if (resolved) {
    patientName = resolved.demographics.displayName;
    dateOfBirth = resolved.demographics.dateOfBirth;
    patientId = resolved.demographics.patientId;
    patientIdType = resolved.demographics.patientIdType;
    sex = resolved.demographics.sex;
    allergyStatus = resolved.demographics.allergies;
  } else {
    patientIdType = ACTIVE_PATIENT.demographics.patientIdType;
  }
  const idLabel = patientIdType === 'NHS' ? 'NHS number' : patientIdType === 'CHI' ? 'CHI number' : 'Patient identifier';

  return (
    <div className={`border border-border bg-background-soft rounded-lg p-4 flex items-center gap-4 ${className}`}>
      {/* Patient Information */}
      <div className="flex-1 min-w-0">
        {/* Patient Name */}
        <div className="text-base font-semibold text-text-primary mb-1">
          {patientName}
        </div>

        {/* Demographics - Single line with separators */}
        <div className="text-sm text-text-secondary flex items-center gap-2 flex-wrap">
          <span>Born: {dateOfBirth}</span>
          <span className="opacity-50">•</span>
          <span>{idLabel}: {patientId}</span>
          <span className="opacity-50">•</span>
          <span>Sex: {sex}</span>
        </div>
      </div>

      {/* Allergy Chip */}
      <AllergyChip status={getAllergyStatus(allergyStatus ?? '')} />

      {/* More Actions Button */}
      <button
        className="w-10 h-10 flex items-center justify-center text-primary-main hover:text-text-primary transition-colors flex-shrink-0 cursor-pointer"
        aria-label="More actions"
      >
        <MoreVerticalIcon size={20} />
      </button>
    </div>
  );
}

// Skeleton shimmer line — CSS animation only, no JS RAF loop
function SkeletonLine({ width = 'full' }: { width?: string }) {
  return <div className={`h-3 w-${width} bg-primary-light rounded animate-pulse`} />;
}

function WidgetContent({ title, patientId }: { title: string; patientId: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Prevent duplicate fetches in React Strict Mode
  const fetched = useRef(false);

  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const complexity = calcComplexity(patient).level;
  const risk = calcRisk(patient).level;

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch('/api/summarize-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgetTitle: title, patientId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [title]);

  if (loading) {
    return (
      <div className="space-y-3">
        {title === 'Summary' && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-28 bg-primary-light rounded-full opacity-40" />
            <div className="h-6 w-20 bg-primary-light rounded-full opacity-40" />
          </div>
        )}
        <SkeletonLine width="3/4" />
        <SkeletonLine width="full" />
        <SkeletonLine width="2/3" />
        <SkeletonLine width="5/6" />
        <SkeletonLine width="1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-text-tertiary italic">
        Unable to load summary. Check your API key.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {title === 'Summary' ? (
        <SummaryContent
          text={summary!}
          complexity={complexity}
          risk={risk}
        />
      ) : (
        <BulletOrParagraph text={summary!} />
      )}
    </motion.div>
  );
}

// Renders **bold** markdown inline within a text string
function RichText({ text, className = '', boldColor }: { text: string; className?: string; boldColor?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold" style={boldColor ? { color: boldColor } : undefined}>{part}</strong>
          : part
      )}
    </span>
  );
}

// Parses sectioned summary text: **Heading** lines introduce bullet groups
function parseSummarySections(text: string): Array<{ heading: string | null; bullets: string[] }> {
  const sections: Array<{ heading: string | null; bullets: string[] }> = [];
  let current: { heading: string | null; bullets: string[] } = { heading: null, bullets: [] };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const headingMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (headingMatch) {
      if (current.bullets.length > 0 || current.heading !== null) {
        sections.push(current);
      }
      current = { heading: headingMatch[1], bullets: [] };
    } else if (line.startsWith('•')) {
      current.bullets.push(line.slice(1).trim());
    } else {
      current.bullets.push(line);
    }
  }
  if (current.bullets.length > 0 || current.heading !== null) {
    sections.push(current);
  }
  return sections;
}

// Summary widget: Complexity/Risk chips, then sectioned bullet content
function SummaryContent({ text, complexity, risk }: { text: string; complexity?: RiskLevel; risk?: RiskLevel }) {
  const sections = useMemo(() => parseSummarySections(text), [text]);

  return (
    <div className="space-y-3">
      {/* Complexity / Risk chips */}
      {(complexity || risk) && (
        <div className="flex items-center gap-3 flex-wrap">
          {complexity && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">Complexity</span>
              <span className="text-sm text-text-secondary">:</span>
              <RiskStatusChip level={complexity} />
            </div>
          )}
          {risk && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">Risk</span>
              <span className="text-sm text-text-secondary">:</span>
              <RiskStatusChip level={risk} />
            </div>
          )}
        </div>
      )}

      {/* Sectioned content */}
      {sections.map((section, si) => (
        <div key={si} className="space-y-1.5">
          {section.heading && (
            <p className="text-sm font-semibold text-text-primary">{section.heading}</p>
          )}
          {section.bullets.length > 0 && (
            <ul className="space-y-1">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-2 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
                  <RichText text={b} className="text-sm text-text-primary leading-relaxed" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// Other widgets: bullet list or plain paragraph
function BulletOrParagraph({ text }: { text: string }) {
  const hasBullets = text.startsWith('•') || text.includes('\n•');
  if (hasBullets) {
    return (
      <ul className="space-y-1.5">
        {text.split('\n').filter(Boolean).map((line, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
            <RichText
              text={line.startsWith('•') ? line.slice(1).trim() : line}
              className="text-sm text-text-primary leading-relaxed"
            />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-sm text-text-primary leading-relaxed">
      <RichText text={text} />
    </p>
  );
}

// Maps encounter type strings to a display label
function encounterLabel(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes('telephone') || lower.includes('phone')) return 'Telephone call';
  if (lower.includes('a&e') || lower.includes('emergency') || lower.includes('admission')) return 'Emergency admission';
  if (lower.includes('review') || lower.includes('annual') || lower.includes('diabetes') || lower.includes('falls') || lower.includes('copd')) return 'Consultation';
  if (lower.includes('registration')) return 'Consultation';
  if (lower.includes('acute')) return 'Acute appointment';
  return 'Consultation';
}

function EncounterTile({ enc }: { enc: NonNullable<Patient['encounters'][number]> }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary">{encounterLabel(enc.type)}</span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          On {enc.date} at {enc.time}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Clinician & Location */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Clinician &amp; Location</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">GP</span>
                <span className="text-sm font-medium text-text-primary">{enc.clinician}</span>
              </div>
              {enc.location && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Location</span>
                  <span className="text-sm font-medium text-text-primary">{enc.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-text-primary leading-relaxed">{enc.summaryNotes}</p>
          </div>

          {/* Observations */}
          {enc.observations && Object.keys(enc.observations).length > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Observations</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {Object.entries(enc.observations).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-text-secondary">{key}</span>
                    <span className="text-sm font-medium text-text-primary">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnosis */}
          {enc.diagnosis && enc.diagnosis.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Diagnosis</p>
              <ul className="space-y-1">
                {enc.diagnosis.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-2 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
                    <span className="text-sm text-text-primary">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EncountersContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const encounters = [...patient.encounters].reverse();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {encounters.map((enc, i) => (
        <EncounterTile key={i} enc={enc} />
      ))}
    </motion.div>
  );
}

function LifestyleEntry({ term, date, value, history, unit }: {
  term: string;
  date: string;
  value: string;
  history?: MetricHistoryPoint[];
  unit?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [sparkOpen, setSparkOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const valueRef = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  const handleValueMouseEnter = () => {
    if (!valueRef.current) return;
    const rect = valueRef.current.getBoundingClientRect();
    setTruncated(valueRef.current.scrollWidth > valueRef.current.clientWidth);
    setTooltipCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setTooltipVisible(true);
  };

  const handleTrendClick = () => {
    if (!btnRef.current) return;
    setAnchorRect(btnRef.current.getBoundingClientRect());
    setSparkOpen(true);
  };

  const hasHistory = history && history.length > 0;

  const trendDirection = useMemo(() => {
    if (!history || history.length < 2) return null;
    const parse = (v: string) => parseFloat(v.replace(/[^\d.]/g, ''));
    const first = parse(history[0].value);
    const last  = parse(history[history.length - 1].value);
    if (isNaN(first) || isNaN(last) || first === last) return null;
    return last > first ? 'up' : 'down';
  }, [history]);

  return (
    <>
      <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
        <span className="text-sm text-text-secondary flex-shrink-0 w-40 truncate">{term}</span>
        <span
          ref={valueRef}
          className="text-sm font-medium text-text-primary flex-1 min-w-0 truncate cursor-default"
          onMouseEnter={handleValueMouseEnter}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {value}
        </span>
        <span className="text-xs text-text-secondary flex-shrink-0 whitespace-nowrap">{date}</span>
        {hasHistory && trendDirection ? (
          <button
            ref={btnRef}
            onClick={handleTrendClick}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-hover transition-colors text-text-secondary"
            aria-label={`Show trend for ${term}`}
          >
            {trendDirection === 'up' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4L4 12H9V20H15V12H20L12 4Z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 20L20 12H15V4H9V12H4L12 20Z" />
              </svg>
            )}
          </button>
        ) : (
          <span className="flex-shrink-0 w-6" />
        )}
      </div>

      {/* Value tooltip */}
      {tooltipVisible && mounted && createPortal(
        <div className="pointer-events-none fixed z-[9999]" style={{ top: tooltipCoords.top, left: tooltipCoords.left, transform: 'translate(-50%, -100%)' }}>
          <div className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
            {value}
            <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--primary-dark)' }} />
          </div>
        </div>,
        document.body
      )}

      {/* Spark dialog */}
      {sparkOpen && anchorRect && (
        <SparkDialog
          label={term}
          unit={unit ?? ''}
          history={history ?? null}
          anchorRect={anchorRect}
          onClose={() => setSparkOpen(false)}
        />
      )}
    </>
  );
}

function LifestyleContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const ls = patient.lifestyleEntries;
  const ex = patient.examinationEntries;
  const metricHistory = patient.metricHistory ?? {};

  const hasLifestyle = ls && Object.keys(ls).length > 0;
  const hasExaminations = ex && Object.keys(ex).length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6">
      {/* Lifestyle */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Lifestyle</p>
        {!hasLifestyle ? (
          <p className="text-sm text-text-secondary italic">No lifestyle information recorded</p>
        ) : (
          <div className="flex flex-col">
            {ls?.occupation && <LifestyleEntry term={ls.occupation.term} date={ls.occupation.date} value={ls.occupation.value} />}
            {ls?.smoking && <LifestyleEntry term={ls.smoking.term} date={ls.smoking.date} value={ls.smoking.consumption ? `${ls.smoking.status} · ${ls.smoking.consumption}` : ls.smoking.status} />}
            {ls?.alcohol && <LifestyleEntry term={ls.alcohol.term} date={ls.alcohol.date} value={ls.alcohol.consumption} />}
            {ls?.exercise && <LifestyleEntry term={ls.exercise.term} date={ls.exercise.date} value={ls.exercise.type} />}
            {ls?.contraception && ls.contraception.iucdFitted && <LifestyleEntry term={ls.contraception.term} date={ls.contraception.date} value={ls.contraception.iucdFitted} />}
            {ls?.diet && <LifestyleEntry term={ls.diet.term} date={ls.diet.date} value={ls.diet.type ? `${ls.diet.habit} · ${ls.diet.type}` : ls.diet.habit} />}
            {ls?.residence && <LifestyleEntry term={ls.residence.term} date={ls.residence.date} value={ls.residence.type} />}
          </div>
        )}
      </div>

      {/* Examinations */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Examinations</p>
        {!hasExaminations ? (
          <p className="text-sm text-text-secondary italic">No examination data recorded</p>
        ) : (
          <div className="flex flex-col">
            {ex?.weight && <LifestyleEntry term={ex.weight.term} date={ex.weight.date} value={ex.weight.bmi ? `${ex.weight.value} · BMI ${ex.weight.bmi}` : ex.weight.value} history={metricHistory['Weight']} unit="kg" />}
            {ex?.bloodPressure && <LifestyleEntry term={ex.bloodPressure.term} date={ex.bloodPressure.date} value={`${ex.bloodPressure.systolic}/${ex.bloodPressure.diastolic} mmHg`} history={metricHistory['BP']} unit="mmHg" />}
            {ex?.waistCircumference && <LifestyleEntry term="Waist circumference" date={ex.waistCircumference.date} value={`${ex.waistCircumference.systolic}/${ex.waistCircumference.diastolic}`} />}
            {ex?.pulse && <LifestyleEntry term={ex.pulse.term} date={ex.pulse.date} value={ex.pulse.value} history={metricHistory['Pulse']} unit="bpm" />}
            {ex?.oxygenSaturation && <LifestyleEntry term={ex.oxygenSaturation.term} date={ex.oxygenSaturation.date} value={`${ex.oxygenSaturation.value} ${ex.oxygenSaturation.unit}`} history={metricHistory['SpO₂']} unit="%" />}
            {ex?.temperature && <LifestyleEntry term={ex.temperature.term} date={ex.temperature.date} value={ex.temperature.qualifier ? `${ex.temperature.value} ${ex.temperature.unit} · ${ex.temperature.qualifier}` : `${ex.temperature.value} ${ex.temperature.unit}`} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TestsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;

  const groups: { date: string; context: string; items: typeof patient.investigations }[] = [];
  const seen = new Map<string, number>();
  for (const inv of patient.investigations) {
    const key = inv.requestGroup ?? inv.date ?? 'Unknown';
    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ date: key, context: inv.requestContext ?? key, items: [] });
    }
    groups[seen.get(key)!].items.push(inv);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {groups.map((g, i) => (
        <TestGroupTile key={i} date={g.date} context={g.context} items={g.items} />
      ))}
    </motion.div>
  );
}

function ImmunisationTile({ imm }: { imm: NonNullable<Patient['immunisations']>[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-medium text-text-primary truncate">{imm.vaccine}</span>
          {imm.source && <span className="text-xs text-text-secondary truncate">{imm.source}</span>}
        </span>
        {imm.dose && (
          <span className="text-xs text-text-secondary flex-shrink-0 whitespace-nowrap">{imm.dose}</span>
        )}
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap ml-2">On {imm.date}</span>
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Administered by</span>
                <span className="text-sm font-medium text-text-primary">{imm.administeredBy}</span>
              </div>
              {imm.site && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Site</span>
                  <span className="text-sm font-medium text-text-primary">{imm.site}</span>
                </div>
              )}
              {imm.batchNumber && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Batch number</span>
                  <span className="text-sm font-medium text-text-primary">{imm.batchNumber}</span>
                </div>
              )}
              {imm.source && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Source</span>
                  <span className="text-sm font-medium text-text-primary">{imm.source}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImmunisationsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const immunisations = patient.immunisations ?? [];

  if (immunisations.length === 0) {
    return <p className="text-sm text-text-secondary italic">No immunisation records found</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {immunisations.map((imm, i) => (
        <ImmunisationTile key={i} imm={imm} />
      ))}
    </motion.div>
  );
}

const REFERRAL_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:   { bg: 'var(--accent-light)',   text: 'var(--accent-dark)'   },
  Active:    { bg: 'var(--success-light)',  text: 'var(--success-dark)'  },
  Completed: { bg: 'var(--primary-light)',  text: 'var(--text-secondary)' },
};

function ReferralTile({ ref: r }: { ref: NonNullable<Patient['outboundReferrals']>[number] }) {
  const [expanded, setExpanded] = useState(false);
  const statusCol = REFERRAL_STATUS_COLORS[r.status] ?? { bg: 'var(--accent2-light)', text: 'var(--accent2-dark)' };

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-medium text-text-primary truncate">{r.specialty}</span>
          {r.source && <span className="text-xs text-text-secondary truncate">{r.source}</span>}
        </span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">{r.referralDate}</span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusCol.bg, color: statusCol.text }}
        >
          {r.status}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Reason */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Reason</p>
            <p className="text-sm text-text-primary leading-relaxed">{r.reason}</p>
          </div>

          {/* Details */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Referred to</span>
                <span className="text-sm font-medium text-text-primary">{r.referredTo}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Referred by</span>
                <span className="text-sm font-medium text-text-primary">{r.referredBy}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Urgency</span>
                <span className="text-sm font-medium text-text-primary">{r.urgency}</span>
              </div>
              {r.source && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Source</span>
                  <span className="text-sm font-medium text-text-primary">{r.source}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferralsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const referrals = patient.outboundReferrals ?? [];

  if (referrals.length === 0) {
    return <p className="text-sm text-text-secondary italic">No outbound referrals recorded</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {referrals.map((r, i) => (
        <ReferralTile key={i} ref={r} />
      ))}
    </motion.div>
  );
}

function ActivityContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const events = patient.recentActivityFeed ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ActivityTimeline events={events} />
    </motion.div>
  );
}

function MedicationTile({ med }: { med: Patient['currentMedications'][number] }) {
  const [expanded, setExpanded] = useState(false);

  const chipColors: Record<string, { bg: string; text: string }> = {
    Repeat: { bg: 'var(--primary-main)', text: 'var(--primary-contrast)' },
    Acute:  { bg: 'var(--accent-main)',  text: 'var(--accent-contrast)'  },
  };
  const chip = med.prescriptionType ? (chipColors[med.prescriptionType] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-medium text-text-primary truncate">{med.name}</span>
          {(med.strength || med.drugForm) && (
            <span className="text-xs text-text-secondary truncate">
              {[med.strength, med.drugForm].filter(Boolean).join(' · ')}
            </span>
          )}
        </span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          Prescribed on {med.prescribedDate}
        </span>
        {chip && med.prescriptionType && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: chip.bg, color: chip.text }}
          >
            {med.prescriptionType}
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Dosage & frequency */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Dosage & frequency</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Dose</span>
                <span className="text-sm font-medium text-text-primary">{med.dose}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Frequency</span>
                <span className="text-sm font-medium text-text-primary">{med.frequency}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Prescriber</span>
                <span className="text-sm font-medium text-text-primary">{med.prescriber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Prescribed</span>
                <span className="text-sm font-medium text-text-primary">{med.prescribedDate}</span>
              </div>
              {med.prescriptionType && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Type</span>
                  <span className="text-sm font-medium text-text-primary">{med.prescriptionType}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MedicationsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {patient.currentMedications.map((med, i) => (
        <MedicationTile key={i} med={med} />
      ))}
    </motion.div>
  );
}

function AllergyTile({ a }: { a: Patient['allergies'][number] }) {
  const [expanded, setExpanded] = useState(false);

  const chipColors: Record<string, { bg: string; text: string }> = {
    Drug:  { bg: 'var(--primary-main)', text: 'var(--primary-contrast)' },
    Food:  { bg: 'var(--accent-main)',  text: 'var(--accent-contrast)'  },
    Other: { bg: 'var(--accent3-main)', text: 'var(--accent3-contrast)' },
  };
  const chip = a.type ? (chipColors[a.type] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  const severityColors: Record<string, { bg: string; text: string }> = {
    Mild:     { bg: 'var(--success-main)',  text: 'var(--success-contrast)'  },
    Moderate: { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'   },
    Severe:   { bg: 'var(--error-main)',    text: 'var(--error-contrast)'    },
  };
  const severityChip = a.severity ? (severityColors[a.severity] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 min-h-[52px] hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-sm font-medium text-text-primary truncate">{a.substance}</span>
          {a.source && <span className="text-xs text-text-secondary truncate">{a.source}</span>}
        </span>
        {a.recordedDate && (
          <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
            <span className="mr-1">Recorded</span>{a.recordedDate}
          </span>
        )}
        {chip && a.type && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: chip.bg, color: chip.text }}
          >
            {a.type}
          </span>
        )}
        {severityChip && a.severity && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: severityChip.bg, color: severityChip.text }}
          >
            {a.severity}
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Reaction</p>
            <p className="text-sm text-text-primary">{a.reaction}</p>
          </div>
          {a.type === 'Drug' && (a.drugForm || a.strength) && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Medication details</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {a.drugForm && (
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary">Drug Form</span>
                    <span className="text-sm font-medium text-text-primary">{a.drugForm}</span>
                  </div>
                )}
                {a.strength && (
                  <div className="flex flex-col">
                    <span className="text-xs text-text-secondary">Strength</span>
                    <span className="text-sm font-medium text-text-primary">{a.strength}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {a.severity && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Severity</span>
                  <span className="text-sm font-medium text-text-primary">{a.severity}</span>
                </div>
              )}
              {a.status && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Status</span>
                  <span className="text-sm font-medium text-text-primary">{a.status}</span>
                </div>
              )}
              {a.recordedDate && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Recorded</span>
                  <span className="text-sm font-medium text-text-primary">{a.recordedDate}</span>
                </div>
              )}
              {a.recordedBy && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Recorded by</span>
                  <span className="text-sm font-medium text-text-primary">{a.recordedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AllergiesContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const allergies = patient.allergies;

  const drugAllergies = allergies.filter(a => a.type === 'Drug');
  const nonDrugAllergies = allergies.filter(a => a.type !== 'Drug');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Drug allergies</p>
        {drugAllergies.length === 0
          ? <p className="text-sm text-text-secondary italic">No known drug allergies</p>
          : <div className="flex flex-col gap-1">{drugAllergies.map((a, i) => <AllergyTile key={i} a={a} />)}</div>
        }
      </div>
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">Non-drug allergies</p>
        {nonDrugAllergies.length === 0
          ? <p className="text-sm text-text-secondary italic">No known non-drug allergies</p>
          : <div className="flex flex-col gap-1">{nonDrugAllergies.map((a, i) => <AllergyTile key={i} a={a} />)}</div>
        }
      </div>
    </div>
  );
}

function MedicalHistoryTile({ d }: { d: Patient['problemsDiagnoses'][number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 min-h-[52px] hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{d.condition}</span>
        {d.diagnosed && (
          <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
            From {d.diagnosed}
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {d.notes && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Diagnosis notes</p>
              <p className="text-sm text-text-primary leading-relaxed">{d.notes}</p>
            </div>
          )}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Diagnosed</span>
                <span className="text-sm font-medium text-text-primary">{d.diagnosed}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MedicalHistoryContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const priority1 = patient.problemsDiagnoses.filter(d => d.priority === 1);

  if (priority1.length === 0) {
    return <p className="text-sm text-text-secondary italic">No Priority 1 entries</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {priority1.map((d, i) => (
        <MedicalHistoryTile key={i} d={d} />
      ))}
    </div>
  );
}

function ProblemItemTile({ item }: { item: NonNullable<Patient['problems']>[number]['items'][number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 min-h-[52px] hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{item.condition}</span>
        <span className="text-xs text-text-secondary flex-shrink-0 whitespace-nowrap">{item.status}</span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap ml-2">From {item.onset}</span>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {item.notes && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-text-primary leading-relaxed">{item.notes}</p>
            </div>
          )}
          {item.source && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Source</span>
                <span className="text-sm font-medium text-text-primary">{item.source}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProblemsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;

  const activeGroups = (patient.problems ?? [])
    .map(g => ({ ...g, items: g.items.filter(i => i.status === 'Active') }))
    .filter(g => g.items.length > 0);

  if (activeGroups.length === 0) {
    return <p className="text-sm text-text-secondary italic">No active problems recorded</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {activeGroups.map((g, gi) => (
        <div key={gi}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{g.groupTitle}</p>
            {g.source && <p className="text-xs text-text-secondary">{g.source}</p>}
          </div>
          <div className="flex flex-col gap-1">
            {g.items.map((item, ii) => (
              <ProblemItemTile key={ii} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryWidgetContent({ patientId, careMode }: { patientId: string; careMode?: 'primary' | 'urgent' }) {
  function SectionHeading({ title, first }: { title: string; first?: boolean }) {
    return (
      <div className={`${first ? 'mb-3' : 'mt-8 mb-3'}`}>
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <div className="border-t border-border mt-2" />
      </div>
    );
  }

  return (
    <div>
      {careMode === 'urgent' ? (
        <>
          <SectionHeading title="Active problems" first />
          <ProblemsContent patientId={patientId} />
        </>
      ) : (
        <>
          <SectionHeading title="Medical history (Priority 1)" first />
          <MedicalHistoryContent patientId={patientId} />
        </>
      )}

      <SectionHeading title="Allergies" />
      <AllergiesContent patientId={patientId} />

      <SectionHeading title="Lifestyle &amp; examinations" />
      <LifestyleContent patientId={patientId} />
    </div>
  );
}

function TrackerIconButton({ icon: Icon, label, count }: { icon: React.FC<{ size?: number; className?: string }>; label: string; count: number }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setVisible(true);
  };

  const tooltip = visible && mounted ? createPortal(
    <div className="pointer-events-none fixed z-[9999]" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}>
      <div className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
        {label}
        <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--primary-dark)' }} />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        className="relative w-10 h-10 rounded-full border border-border bg-primary-contrast flex items-center justify-center hover:bg-hover transition-colors flex-shrink-0"
        aria-label={label}
      >
        <Icon size={18} className="text-text-secondary" />
        <span
          className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold rounded-full leading-none px-1"
          style={{ backgroundColor: count > 0 ? 'var(--accent-dark)' : 'var(--grey-80)', color: 'var(--primary-contrast)' }}
        >
          {count}
        </span>
      </button>
      {tooltip}
    </>
  );
}

function PatientTracker({ patientId, careMode }: { patientId: string; careMode?: 'primary' | 'urgent' }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const tracker = patient.patientTracker;
  if (!tracker) return null;

  return (
    <div className="inline-flex items-center gap-2 mb-6 self-start">
      {/* Icon buttons with badge counts — primary care only */}
      {careMode !== 'urgent' && (
        <>
          <TrackerIconButton icon={CalendarIcon} label="Outstanding items" count={tracker.outstandingTasks} />
          <TrackerIconButton icon={ReferralIcon} label="Open referrals" count={tracker.openReferrals} />
          <TrackerIconButton icon={PillIcon} label="Medication reviews due" count={tracker.medicationReviewsDue} />
        </>
      )}

      {/* Divider — only needed when icon buttons are visible */}
      {careMode !== 'urgent' && <div className="w-px h-8 bg-border mx-1 flex-shrink-0" />}

      {/* Appointment pills */}
      {[
        { label: 'Next appointment', value: tracker.nextAppointment },
      ].map(({ label, value }) => (
        <div key={label} className="h-10 flex items-center gap-2 border border-border rounded-full bg-primary-contrast px-3 flex-shrink-0">
          <CalendarIcon size={18} className="text-text-secondary flex-shrink-0" />
          <span className="text-sm text-text-secondary whitespace-nowrap">{label}:</span>
          <span className="text-sm font-semibold text-text-primary whitespace-nowrap">{value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}

function SpecialNotesContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const notes = patient.specialNotes ?? [];

  return (
    <div className="flex flex-col gap-3">
      {notes.map(n => (
        <div key={n.id}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--error-dark)' }}>{n.note}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--error-main)' }}>{n.recordedDate}{n.source ? ` · ${n.source}` : ''}</p>
        </div>
      ))}
    </div>
  );
}

function WidgetShell({ widget, index, stretch, colorScheme, onWidgetClick, children }: { widget: { id: string; title: string }; index: number; stretch?: boolean; colorScheme?: 'error'; onWidgetClick?: (title: string) => void; children: React.ReactNode }) {
  const isError = colorScheme === 'error';
  return (
    <motion.div
      key={widget.id}
      className={`rounded-lg overflow-hidden flex flex-col${stretch ? ' flex-1' : ''}`}
      style={{
        border: isError ? '1px solid var(--error-light)' : '1px solid var(--border)',
        backgroundColor: isError ? 'var(--error-contrast)' : 'var(--primary-contrast)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-4 flex items-center justify-between">
        <h3
          className="text-sm font-semibold flex-1"
          style={{ color: isError ? 'var(--error-dark)' : 'var(--text-primary)' }}
        >
          {widget.title}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onWidgetClick?.(widget.title)}
            className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
            aria-label={`Open ${widget.title}`}
          >
            <span style={{ color: isError ? 'var(--error-main)' : 'var(--primary-main)' }}>
              <ArrowRightIcon size={20} />
            </span>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
            aria-label={`${widget.title} options`}
          >
            <span style={{ color: isError ? 'var(--error-main)' : 'var(--primary-main)' }}>
              <MoreVerticalIcon size={20} />
            </span>
          </button>
        </div>
      </div>
      <div style={{ borderTop: isError ? '1px solid var(--error-light)' : '1px solid var(--border)' }} />
      <div className={`p-4${stretch ? ' flex-1 overflow-y-auto' : ''}`}>{children}</div>
    </motion.div>
  );
}

export function PatientSummaryCard({
  onWidgetClick,
  showWidgets = true,
  className = '',
  activePatientId,
  careMode = 'primary',
}: PatientSummaryCardProps) {
  const resolvedPatientId = activePatientId ?? ACTIVE_PATIENT.id;

  if (!showWidgets) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* Tracker row — aligned to left column only */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <PatientTracker patientId={resolvedPatientId} careMode={careMode} />
        </div>
        <div className="flex-1 min-w-0" />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
      {/* Left column — fills available height */}
      <div className="flex flex-col gap-6" style={{ alignSelf: 'stretch' }}>
        {/* Special notes — urgent care only, hidden when no notes */}
        {careMode === 'urgent' && (() => {
          const patient = PATIENT_REGISTRY[resolvedPatientId] ?? ACTIVE_PATIENT;
          return (patient.specialNotes?.length ?? 0) > 0 ? (
            <WidgetShell widget={{ id: 'special-notes', title: 'Special patient notes' }} index={0} colorScheme="error" onWidgetClick={onWidgetClick}>
              <SpecialNotesContent patientId={resolvedPatientId} />
            </WidgetShell>
          ) : null;
        })()}
        <WidgetShell widget={SUMMARY_WIDGET} index={careMode === 'urgent' ? 1 : 0} stretch onWidgetClick={onWidgetClick}>
          <SummaryWidgetContent patientId={resolvedPatientId} careMode={careMode} />
        </WidgetShell>
      </div>

      {/* Right column — hugs content */}
      <div className="flex flex-col gap-6 pb-10">
        {(careMode === 'urgent' ? STACK_WIDGETS_URGENT : STACK_WIDGETS_PRIMARY).map((widget, index) => (
          <WidgetShell key={widget.id} widget={widget} index={index + 1} onWidgetClick={onWidgetClick}>
            {widget.title === 'Recent encounters' ? (
              <EncountersContent patientId={resolvedPatientId} />
            ) : widget.title === 'Current medications' ? (
              <MedicationsContent patientId={resolvedPatientId} />
            ) : widget.title === 'Recent tests' ? (
              <TestsContent patientId={resolvedPatientId} />
            ) : widget.title === 'Immunisations' ? (
              <ImmunisationsContent patientId={resolvedPatientId} />
            ) : widget.title === 'Primary care outbound referrals' ? (
              <ReferralsContent patientId={resolvedPatientId} />
            ) : null}
          </WidgetShell>
        ))}
      </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'iqons-react';

interface Patient {
  id: string;
  name: string;
  dob: string;
  age: number;
  sex: string;
  nhsNumber: string;
  gp: string;
  condition: string;
  lastSeen: string;
  status: string;
}

type SortKey = keyof Patient;
type SortDir = 'asc' | 'desc';

const FIRST_NAMES = ['Margaret', 'James', 'Patricia', 'Robert', 'Linda', 'Michael', 'Barbara', 'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Dorothy', 'Donald', 'Sandra', 'Mark', 'Ashley', 'Paul', 'Kimberly', 'Steven', 'Donna', 'Andrew', 'Emily', 'Kenneth', 'Carol', 'Joshua', 'Michelle', 'Kevin'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];
const GPs = ['Dr. Patel', 'Dr. Chen', 'Dr. Okonkwo', 'Dr. Singh', 'Dr. Williams', 'Dr. Macdonald', 'Dr. Hassan', 'Dr. Park'];
const CONDITIONS = ['Hypertension', 'Type 2 Diabetes', 'Asthma', 'COPD', 'Atrial Fibrillation', 'Osteoarthritis', 'Depression', 'Anxiety', 'Hypothyroidism', 'Chronic Kidney Disease', 'Heart Failure', 'Obesity', 'Hyperlipidaemia', 'IBS'];
const STATUSES = ['Active', 'Active', 'Active', 'Review due', 'Review due', 'Urgent'];
const STATUS_STYLES: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 border border-green-200',
  'Review due': 'bg-amber-50 text-amber-700 border border-amber-200',
  'Urgent': 'bg-red-50 text-red-700 border border-red-200',
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generatePatients(): Patient[] {
  return Array.from({ length: 80 }, (_, i) => {
    const rng = seededRandom(i * 7 + 13);
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const age = 25 + Math.floor(rng() * 65);
    const year = 2025 - age;
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);
    const daysAgo = Math.floor(rng() * 180);
    const lastDate = new Date(2026, 8, 11);
    lastDate.setDate(lastDate.getDate() - daysAgo);
    const nhsA = 100 + Math.floor(rng() * 900);
    const nhsB = 100 + Math.floor(rng() * 900);
    const nhsC = 1000 + Math.floor(rng() * 9000);
    return {
      id: `PT-${10001 + i}`,
      name: `${firstName} ${lastName}`,
      dob: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
      age,
      sex: rng() > 0.48 ? 'Female' : 'Male',
      nhsNumber: `${nhsA} ${nhsB} ${nhsC}`,
      gp: GPs[Math.floor(rng() * GPs.length)],
      condition: CONDITIONS[Math.floor(rng() * CONDITIONS.length)],
      lastSeen: lastDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: STATUSES[Math.floor(rng() * STATUSES.length)],
    };
  });
}

const PATIENTS = generatePatients();

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'id',        label: 'Patient ID',   width: 'w-24' },
  { key: 'name',      label: 'Name',         width: 'w-40' },
  { key: 'dob',       label: 'Date of Birth', width: 'w-28' },
  { key: 'age',       label: 'Age',          width: 'w-14' },
  { key: 'sex',       label: 'Sex',          width: 'w-16' },
  { key: 'nhsNumber', label: 'NHS Number',   width: 'w-32' },
  { key: 'gp',        label: 'GP',           width: 'w-32' },
  { key: 'condition', label: 'Condition',    width: 'w-44' },
  { key: 'lastSeen',  label: 'Last Seen',    width: 'w-28' },
  { key: 'status',    label: 'Status',       width: 'w-28' },
];

export function PatientDataTableCard({ className = '' }: { className?: string }) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const rows = useMemo(() => {
    let data = PATIENTS;
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.nhsNumber.includes(q) ||
        p.gp.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    }
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir, search]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search bar */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search patients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 w-72 px-3 text-sm border border-border rounded-lg bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary-main"
        />
        <span className="text-xs text-text-secondary">{rows.length} patients</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-background border-b border-border">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide cursor-pointer select-none whitespace-nowrap hover:text-text-primary transition-colors ${col.width ?? ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key ? (
                      sortDir === 'asc'
                        ? <ChevronUp size={12} className="text-text-primary" />
                        : <ChevronDown size={12} className="text-text-primary" />
                    ) : (
                      <span className="w-3 h-3 inline-block" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((patient, i) => (
              <tr
                key={patient.id}
                className={`border-b border-border last:border-0 hover:bg-hover transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-background/50'}`}
              >
                <td className="px-4 py-3 text-text-secondary font-mono text-xs whitespace-nowrap">{patient.id}</td>
                <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{patient.name}</td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{patient.dob}</td>
                <td className="px-4 py-3 text-text-secondary">{patient.age}</td>
                <td className="px-4 py-3 text-text-secondary">{patient.sex}</td>
                <td className="px-4 py-3 text-text-secondary font-mono text-xs whitespace-nowrap">{patient.nhsNumber}</td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{patient.gp}</td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{patient.condition}</td>
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{patient.lastSeen}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[patient.status] ?? ''}`}>
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-text-secondary text-sm">
                  No patients match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

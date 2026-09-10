'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PHRASES = [
  'Thinking...',
  'Analysing...',
  'Fetching...',
  'Building...',
  'Processing...',
  'Searching...',
  'Working on it...',
  'Almost there...',
];

function TwinkleGhostIcon() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const POSITIONS: [number, number][] = [
      [6, 6],  [12, 6],  [18, 6],
      [6, 12], [12, 12], [18, 12],
      [6, 18], [12, 18], [18, 18],
    ];

    const lit = new Set([0, 4, 8]);

    const circles = POSITIONS.map(([cx, cy]) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', String(cx));
      c.setAttribute('cy', String(cy));
      c.setAttribute('r', '2');
      c.style.transition = 'fill 130ms ease';
      svg.appendChild(c);
      return c;
    });

    function applyColors() {
      circles.forEach((c, i) =>
        c.setAttribute('fill', lit.has(i) ? 'var(--primary-main)' : 'transparent')
      );
    }

    let timeout: ReturnType<typeof setTimeout>;

    function scheduleSwap() {
      timeout = setTimeout(() => {
        const litArr = [...lit];
        const unlitArr = circles.map((_, i) => i).filter(i => !lit.has(i));
        const turnOff = litArr[Math.floor(Math.random() * litArr.length)];
        const turnOn = unlitArr[Math.floor(Math.random() * unlitArr.length)];
        lit.delete(turnOff);
        lit.add(turnOn);
        applyColors();
        scheduleSwap();
      }, 120 + Math.random() * 360);
    }

    requestAnimationFrame(() => {
      applyColors();
      scheduleSwap();
    });

    return () => {
      clearTimeout(timeout);
      circles.forEach(c => c.remove());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    />
  );
}

export function ThinkingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % PHRASES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="thinking-row" style={{ gap: '10px' }}>
      <TwinkleGhostIcon />

      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="thinking-shimmer-text text-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

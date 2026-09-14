'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// ─── All 7 bars from DialogueIcon ────────────────────────────────────────────
// Each entry: path data, fill colour, fill opacity, and the midpoint of the bar
// used as the dot centre and scale origin.

const BARS = [
  // 3 foreground bars
  {
    d: 'M39.352 20.8865C41.0295 21.8535 41.6042 23.9952 40.6358 25.6703L23.1014 55.9975C22.133 57.6726 19.9882 58.2463 18.3109 57.2794C16.6336 56.3124 16.0588 54.1705 17.0273 52.4957L34.5617 22.1682C35.5301 20.4934 37.6748 19.9195 39.352 20.8865Z',
    fill: '#F15D22', opacity: 1,
    cx: 28.8, cy: 39.1,
  },
  {
    d: 'M59.2971 28.4095C60.9744 29.3765 61.5491 31.5182 60.5807 33.193L39.5394 69.586C38.571 71.2609 36.4263 71.8348 34.749 70.8677C33.0716 69.9007 32.4969 67.759 33.4653 66.0841L54.5066 29.6912C55.475 28.0163 57.6197 27.4424 59.2971 28.4095Z',
    fill: '#F68E1E', opacity: 1,
    cx: 47.0, cy: 49.5,
  },
  {
    d: 'M78.4808 44.2505C79.6107 42.2966 79.167 39.9286 77.4896 38.9616C75.8123 37.9945 73.5366 38.7948 72.4069 40.7487L51.95 76.1306C50.8203 78.0848 51.264 80.4528 52.9415 81.4198C54.6187 82.3869 56.8944 81.5867 58.0241 79.6325L78.4808 44.2505Z',
    fill: '#F68E1E', opacity: 1,
    cx: 65.2, cy: 60.0,
  },
  // 4 background bars
  {
    d: 'M56.7542 18.8181C57.7226 17.1432 57.148 15.0015 55.4707 14.0344C53.7934 13.0674 51.6485 13.6413 50.6803 15.3162L19.1183 69.9056C18.1499 71.5805 18.7246 73.7221 20.4019 74.6892C22.0793 75.6562 24.224 75.0824 25.1924 73.4075L56.7542 18.8181Z',
    fill: '#F15D22', opacity: 0.4,
    cx: 37.9, cy: 44.4,
  },
  {
    d: 'M64.8402 46.85C65.8851 45.0431 65.3723 42.7941 63.6949 41.8271C62.0176 40.8601 59.8109 41.541 58.766 43.3482L47.4158 62.9795C46.3711 64.7865 46.8838 67.0352 48.5613 68.0022C50.2385 68.9693 52.4452 68.2885 53.4899 66.4814L64.8402 46.85Z',
    fill: '#F15D22', opacity: 0.4,
    cx: 56.1, cy: 54.9,
  },
  {
    d: 'M77.8295 59.4053C79.5069 60.3724 80.0816 62.514 79.1132 64.1889L75.6061 70.2544C74.6377 71.9295 72.493 72.5034 70.8158 71.5363C69.1383 70.5691 68.5636 68.4274 69.5323 66.7525L73.0391 60.687C74.0075 59.0122 76.1522 58.4383 77.8295 59.4053Z',
    fill: '#F15D22', opacity: 0.4,
    cx: 74.3, cy: 65.5,
  },
  {
    d: 'M24.5697 32.4575C25.5597 30.7453 25.0023 28.5733 23.3251 27.6063C21.6478 26.6393 19.4856 27.2434 18.4956 28.9556L14.9106 35.1562C13.9206 36.8686 14.4778 39.0405 16.1551 40.0076C17.8324 40.9746 19.9947 40.3705 20.9847 38.6582L24.5697 32.4575Z',
    fill: '#F15D22', opacity: 0.4,
    cx: 19.7, cy: 33.8,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'dots-in' | 'dots-pulse' | 'bars-grow' | 'logo-zoom' | 'logo-fly' | 'landed' | 'done';

type Rect = { left: number; top: number; width: number; height: number };

// ─── Component ────────────────────────────────────────────────────────────────
export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('dots-in');
  const [barsVisible, setBarsVisible] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(1);
  const [flyToHero, setFlyToHero] = useState(false);
  const [landed, setLanded] = useState(false);
  const [flyStart, setFlyStart] = useState<Rect | null>(null);
  const [heroTarget, setHeroTarget] = useState<Rect | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const iconRef = useRef<HTMLDivElement>(null);

  // 18% of viewport width, min 200px
  const [iconW, setIconW] = useState(300);
  const iconH = iconW * (96 / 94);

  useEffect(() => {
    setIconW(Math.max(200, window.innerWidth * 0.18));
  }, []);

  useEffect(() => {
    if (prefersReduced) { onComplete(); return; }

    const t = (ms: number, fn: () => void) => setTimeout(fn, ms);
    const timers = [
      // dots appear staggered
      t(550,  () => setPhase('dots-pulse')),
      // dots pulse
      t(1100, () => {
        setPhase('bars-grow');
        setTimeout(() => setBarsVisible(true), 60);
        setTimeout(() => setDotsVisible(false), 180);
      }),
      // bars grow in
      t(2000, () => { setPhase('logo-zoom'); setLogoScale(1.1); }),
      t(2380, () => setLogoScale(1)),
      // fly up to hero position
      t(2750, () => {
        // measure icon's current screen rect
        if (iconRef.current) {
          const r = iconRef.current.getBoundingClientRect();
          setFlyStart({ left: r.left, top: r.top, width: r.width, height: r.height });
        }
        // find the hero icon container via data attribute
        const hero = document.querySelector('[data-intro-hero-icon]');
        if (hero) {
          const r = hero.getBoundingClientRect();
          setHeroTarget({ left: r.left, top: r.top, width: r.width, height: r.height });
        }
        setPhase('logo-fly');
        setFlyToHero(true);
      }),
      // landing: show pulse ring
      t(3300, () => { setPhase('landed'); setLanded(true); }),
      // fade overlay
      t(3700, () => setOverlayOpacity(0)),
      // done
      t(4100, () => { setPhase('done'); onComplete(); }),
    ];
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: '#FBFAF4' }}
      animate={{ opacity: overlayOpacity }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* ── Static centred logo during grow/zoom ─────────────────────────── */}
      {!flyToHero && (
        <motion.div
          ref={iconRef}
          style={{ width: iconW, height: iconH }}
          animate={{ scale: logoScale }}
          transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <LogoSVG
            width={iconW}
            height={iconH}
            barsVisible={barsVisible}
            dotsVisible={dotsVisible}
            phase={phase}
          />
        </motion.div>
      )}

      {/* ── Flying logo — from centre to hero position ───────────────────── */}
      <AnimatePresence>
        {flyToHero && flyStart && heroTarget && (
          <motion.div
            className="absolute"
            initial={{
              left: flyStart.left,
              top: flyStart.top,
              width: flyStart.width,
              height: flyStart.height,
            }}
            animate={{
              left: heroTarget.left,
              top: heroTarget.top,
              width: heroTarget.width,
              height: heroTarget.height,
            }}
            transition={{
              duration: 0.52,
              ease: [0.32, 0, 0.12, 1],
            }}
            onAnimationComplete={() => {}}
          >
            <svg width="100%" height="100%" viewBox="0 0 94 96" fill="none">
              {BARS.map((b, i) => (
                <path
                  key={i}
                  d={b.d}
                  fill={b.fill}
                  fillOpacity={b.opacity}
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pulse ring — emits from hero icon position on landing ─────────── */}
      <AnimatePresence>
        {landed && heroTarget && (
          <PulseRing heroTarget={heroTarget} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Pulse ring ───────────────────────────────────────────────────────────────
function PulseRing({ heroTarget }: { heroTarget: Rect }) {
  const cx = heroTarget.left + heroTarget.width / 2;
  const cy = heroTarget.top + heroTarget.height / 2;
  const r = Math.max(heroTarget.width, heroTarget.height) * 0.7;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        marginLeft: -r,
        marginTop: -r,
        border: '2px solid #F15D22',
      }}
      initial={{ scale: 0.5, opacity: 0.7 }}
      animate={{ scale: 2.8, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.2, 0, 0.6, 1] }}
    />
  );
}

// ─── Static SVG with animated dots and bars ──────────────────────────────────
function LogoSVG({
  width,
  height,
  barsVisible,
  dotsVisible,
  phase,
}: {
  width: number;
  height: number;
  barsVisible: boolean;
  dotsVisible: boolean;
  phase: Phase;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 94 96" fill="none">
      {/* Bars — grow out from their dot centre */}
      {BARS.map((b, i) => (
        <motion.path
          key={`bar-${i}`}
          d={b.d}
          fill={b.fill}
          fillOpacity={b.opacity}
          fillRule="evenodd"
          clipRule="evenodd"
          initial={{ scale: 0, opacity: 0 }}
          animate={barsVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          style={{
            originX: `${b.cx}px`,
            originY: `${b.cy}px`,
            transformBox: 'fill-box',
          }}
          transition={{
            duration: 0.55,
            delay: i * 0.06,
            ease: [0.34, 1.15, 0.64, 1],
          }}
        />
      ))}

      {/* Dots — one per bar, shown before bars appear */}
      {BARS.map((b, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={b.cx}
          cy={b.cy}
          r={6}
          fill={b.fill}
          fillOpacity={b.opacity}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            !dotsVisible
              ? { scale: 0, opacity: 0 }
              : phase === 'dots-pulse'
              ? { scale: [1, 1.5, 1], opacity: b.opacity }
              : { scale: 1, opacity: b.opacity }
          }
          style={{
            originX: `${b.cx}px`,
            originY: `${b.cy}px`,
            transformBox: 'fill-box',
          }}
          transition={
            !dotsVisible
              ? { duration: 0.15, ease: 'easeIn' }
              : phase === 'dots-pulse'
              ? { duration: 0.4, delay: i * 0.07, ease: 'easeInOut' }
              : { duration: 0.35, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }
          }
        />
      ))}
    </svg>
  );
}

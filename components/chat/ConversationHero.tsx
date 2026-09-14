'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BARS = [
  { d: 'M39.352 20.8865C41.0295 21.8535 41.6042 23.9952 40.6358 25.6703L23.1014 55.9975C22.133 57.6726 19.9882 58.2463 18.3109 57.2794C16.6336 56.3124 16.0588 54.1705 17.0273 52.4957L34.5617 22.1682C35.5301 20.4934 37.6748 19.9195 39.352 20.8865Z',  fill: '#F15D22', fillOpacity: 1   },
  { d: 'M59.2971 28.4095C60.9744 29.3765 61.5491 31.5182 60.5807 33.193L39.5394 69.586C38.571 71.2609 36.4263 71.8348 34.749 70.8677C33.0716 69.9007 32.4969 67.759 33.4653 66.0841L54.5066 29.6912C55.475 28.0163 57.6197 27.4424 59.2971 28.4095Z',    fill: '#F68E1E', fillOpacity: 1   },
  { d: 'M78.4808 44.2505C79.6107 42.2966 79.167 39.9286 77.4896 38.9616C75.8123 37.9945 73.5366 38.7948 72.4069 40.7487L51.95 76.1306C50.8203 78.0848 51.264 80.4528 52.9415 81.4198C54.6187 82.3869 56.8944 81.5867 58.0241 79.6325L78.4808 44.2505Z',      fill: '#F68E1E', fillOpacity: 1   },
  { d: 'M56.7542 18.8181C57.7226 17.1432 57.148 15.0015 55.4707 14.0344C53.7934 13.0674 51.6485 13.6413 50.6803 15.3162L19.1183 69.9056C18.1499 71.5805 18.7246 73.7221 20.4019 74.6892C22.0793 75.6562 24.224 75.0824 25.1924 73.4075L56.7542 18.8181Z',  fill: '#F15D22', fillOpacity: 0.4 },
  { d: 'M64.8402 46.85C65.8851 45.0431 65.3723 42.7941 63.6949 41.8271C62.0176 40.8601 59.8109 41.541 58.766 43.3482L47.4158 62.9795C46.3711 64.7865 46.8838 67.0352 48.5613 68.0022C50.2385 68.9693 52.4452 68.2885 53.4899 66.4814L64.8402 46.85Z',      fill: '#F15D22', fillOpacity: 0.4 },
  { d: 'M77.8295 59.4053C79.5069 60.3724 80.0816 62.514 79.1132 64.1889L75.6061 70.2544C74.6377 71.9295 72.493 72.5034 70.8158 71.5363C69.1383 70.5691 68.5636 68.4274 69.5323 66.7525L73.0391 60.687C74.0075 59.0122 76.1522 58.4383 77.8295 59.4053Z',  fill: '#F15D22', fillOpacity: 0.4 },
  { d: 'M24.5697 32.4575C25.5597 30.7453 25.0023 28.5733 23.3251 27.6063C21.6478 26.6393 19.4856 27.2434 18.4956 28.9556L14.9106 35.1562C13.9206 36.8686 14.4778 39.0405 16.1551 40.0076C17.8324 40.9746 19.9947 40.3705 20.9847 38.6582L24.5697 32.4575Z',  fill: '#F15D22', fillOpacity: 0.4 },
];

const SUBTEXT_VARIATIONS = [
  'Welcome back! Want to try one of these prompts or go your own way?',
  'Welcome back. Start with a prompt below, or jump straight in.',
  'Welcome back! Pick a prompt to get going, or chart your own course.',
  'Welcome back. Need inspiration, or already know where you\'re headed?',
  'Welcome back! Try a starter prompt, or ask anything.',
  'Welcome back. Explore a suggestion below, or make your own move.',
  'Welcome back! Choose a prompt or start from scratch.',
  'Welcome back. Want a quick start, or a blank canvas?',
  'Welcome back! Here are a few ways to begin — or just type away.',
  'Welcome back. Pick a direction below, or blaze your own trail.',
  'Welcome back! Use one of these ideas, or follow your curiosity.',
  'Welcome back. Try a suggested prompt, or dive right into your own.',
  'Welcome back! Start with inspiration below, or create your own path.',
  'Welcome back. What would you like to explore today?',
  'Welcome back! Need a nudge, or ready to freestyle?',
];

interface ConversationHeroProps {
  userName?: string;
  greeting?: string;
  subtext?: string;
  skipAnimation?: boolean;
}

export function ConversationHero({
  userName = 'Liam',
  greeting = `Hey ${userName || 'there'}!`,
  subtext,
  skipAnimation = false,
}: ConversationHeroProps) {
  const prefersReduced = useReducedMotion();
  const play = !skipAnimation && !prefersReduced;

  // Logo rises to resting position at t=1.25s
  const [logoRisen, setLogoRisen] = useState(false);
  useEffect(() => {
    if (!play) { setLogoRisen(true); return; }
    const t = setTimeout(() => setLogoRisen(true), 1250);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [randomSubtext, setRandomSubtext] = useState(subtext || SUBTEXT_VARIATIONS[0]);
  useEffect(() => {
    if (!subtext) {
      setRandomSubtext(SUBTEXT_VARIATIONS[Math.floor(Math.random() * SUBTEXT_VARIATIONS.length)]);
    }
  }, [subtext]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center text-center mb-8">

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="relative mb-6" data-intro-hero-icon>

        {/* Scale: 2× large/centred → 1× resting. transformOrigin top makes it rise upward. */}
        <motion.div
          style={{ transformOrigin: 'center top' }}
          initial={play ? { scale: 2 } : false}
          animate={play ? { scale: logoRisen ? 1 : 2 } : false}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Entrance: blur + slide up + fade in */}
          <motion.div
            initial={play ? { opacity: 0, filter: 'blur(14px)', y: 56 } : false}
            animate={play ? { opacity: 1, filter: 'blur(0px)', y: 0 } : false}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            {/* 7 bars stagger in individually */}
            <svg width={94} height={96} viewBox="0 0 94 96" fill="none">
              {BARS.map((bar, i) => (
                <motion.path
                  key={i}
                  d={bar.d}
                  fill={bar.fill}
                  fillOpacity={bar.fillOpacity}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  initial={play ? { opacity: 0, scale: 0 } : false}
                  animate={play ? { opacity: 1, scale: 1 } : false}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: EASE }}
                />
              ))}
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <motion.h1
        className="text-3xl font-semibold text-text-primary mb-3"
        initial={play ? { opacity: 0, y: 14, filter: 'blur(6px)' } : false}
        animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : false}
        transition={{ duration: 0.7, delay: 1.95, ease: EASE }}
      >
        {greeting}
      </motion.h1>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <motion.p
        className="text-base text-text-secondary w-full"
        initial={play ? { opacity: 0, y: 14, filter: 'blur(6px)' } : false}
        animate={play ? { opacity: 1, y: 0, filter: 'blur(0px)' } : false}
        transition={{ duration: 0.7, delay: 2.15, ease: EASE }}
      >
        {randomSubtext}
      </motion.p>
    </div>
  );
}

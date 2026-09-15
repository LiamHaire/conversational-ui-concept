'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BARS = [
  { d: 'M2.88206 9.24178C3.58379 8.02396 5.13796 7.6067 6.35339 8.30981C7.56882 9.01292 7.98525 10.5701 7.28352 11.788L4.74234 16.1981C4.04061 17.4159 2.48645 17.8331 1.27102 17.13C0.0555867 16.4269 -0.36085 14.8697 0.340879 13.6519L2.88206 9.24178Z', fill: '#F5BAA4', fillOpacity: 1 },
  { d: 'M26.16 19.7671C26.8618 18.5493 28.4159 18.1321 29.6313 18.8352C30.8468 19.5383 31.2632 21.0955 30.5615 22.3133L25.4791 31.1335C24.7774 32.3514 23.2232 32.7686 22.0078 32.0655C20.7924 31.3624 20.3759 29.8052 21.0777 28.5874L26.16 19.7671Z', fill: '#FFB899', fillOpacity: 1 },
  { d: 'M35.2577 29.4403C35.9594 28.2224 37.5136 27.8052 38.729 28.5083C39.9444 29.2114 40.3609 30.7686 39.6591 31.9864L38.3885 34.1915C37.6868 35.4093 36.1326 35.8266 34.9172 35.1235C33.7018 34.4204 33.2853 32.8631 33.9871 31.6453L35.2577 29.4403Z', fill: '#FFB899', fillOpacity: 1 },
  { d: 'M2.88206 9.24178C3.58379 8.02396 5.13796 7.6067 6.35339 8.30981C7.56882 9.01292 7.98525 10.5701 7.28352 11.788L4.74234 16.1981C4.04061 17.4159 2.48645 17.8331 1.27102 17.13C0.0555867 16.4269 -0.36085 14.8697 0.340879 13.6519L2.88206 9.24178Z', fill: '#F68E1E', fillOpacity: 1 },
  { d: 'M22.1444 1.27351C22.8461 0.0556959 24.4003 -0.361559 25.6157 0.341548C26.8311 1.04466 27.2476 2.60188 26.5459 3.81969L7.48697 36.8955C6.78524 38.1133 5.23108 38.5306 4.01565 37.8275C2.80022 37.1244 2.38378 35.5672 3.08551 34.3493L22.1444 1.27351Z', fill: '#F15D22', fillOpacity: 1 },
  { d: 'M25.7406 7.76375C26.4423 6.54593 27.9965 6.12867 29.2119 6.83178C30.4273 7.53489 30.8438 9.09211 30.142 10.3099L14.8949 36.7706C14.1932 37.9884 12.639 38.4057 11.4236 37.7026C10.2082 36.9995 9.79174 35.4422 10.4935 34.2244L25.7406 7.76375Z', fill: '#F68E1E', fillOpacity: 1 },
  { d: 'M34.2029 18.5396C34.9046 17.3218 36.4588 16.9046 37.6742 17.6077C38.8897 18.3108 39.3061 19.868 38.6044 21.0858L28.4396 38.7263C27.7379 39.9441 26.1837 40.3613 24.9683 39.6582C23.7529 38.9551 23.3365 37.3979 24.0382 36.1801L34.2029 18.5396Z', fill: '#F68E1E', fillOpacity: 1 },
  { d: 'M12.1956 5.80916C12.8973 4.59134 14.4515 4.17409 15.6669 4.87719C16.8823 5.5803 17.2987 7.13752 16.597 8.35534L6.43228 25.9958C5.73055 27.2136 4.17639 27.6309 2.96096 26.9277C1.74553 26.2246 1.32909 24.6674 2.03082 23.4496L12.1956 5.80916Z', fill: '#FFB899', fillOpacity: 1 },
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
  onIntroComplete?: () => void;
}

export function ConversationHero({
  userName = 'Liam',
  greeting = `Hey ${userName || 'there'}!`,
  subtext,
  skipAnimation = false,
  onIntroComplete,
}: ConversationHeroProps) {
  const prefersReduced = useReducedMotion();
  const play = !skipAnimation && !prefersReduced;

  // Logo rises to resting position at t=1.25s
  const [logoRisen, setLogoRisen] = useState(false);
  useEffect(() => {
    if (!play) { setLogoRisen(true); return; }
    const t1 = setTimeout(() => setLogoRisen(true), 1250);
    // Mark intro complete after the last element (subtext) has finished animating
    const t2 = setTimeout(() => onIntroComplete?.(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
              <svg width={94} height={94} viewBox="0 0 40 40" fill="none">
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
        className="text-5xl font-semibold text-text-primary mb-3"
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

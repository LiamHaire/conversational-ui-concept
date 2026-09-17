'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SCALE = 94 / 40;
const SVG_W = Math.round(416 * SCALE); // 978
const SVG_H = Math.round(80 * SCALE);  // 188
const BM_CX = Math.round(20 * SCALE);  // 47
const BM_OFFSET_X = SVG_W / 2 - BM_CX; // 442 — centres brandmark regardless of viewport width

const N_LETTERS = 11;
const LETTER_ENTRY_DELAY = 0.05;

const BM_PATHS = [
  { d: 'M2.88206 29.2418C3.58379 28.024 5.13796 27.6067 6.35339 28.3098C7.56882 29.0129 7.98525 30.5701 7.28352 31.788L4.74234 36.1981C4.04061 37.4159 2.48645 37.8331 1.27102 37.13C0.0555867 36.4269 -0.36085 34.8697 0.340879 33.6519L2.88206 29.2418Z', fill: '#F5BAA4' },
  { d: 'M26.16 39.7671C26.8618 38.5493 28.4159 38.1321 29.6313 38.8352C30.8468 39.5383 31.2632 41.0955 30.5615 42.3133L25.4791 51.1335C24.7774 52.3514 23.2232 52.7686 22.0078 52.0655C20.7924 51.3624 20.3759 49.8052 21.0777 48.5874L26.16 39.7671Z', fill: '#FFB899' },
  { d: 'M35.2577 49.4403C35.9594 48.2224 37.5136 47.8052 38.729 48.5083C39.9444 49.2114 40.3609 50.7686 39.6591 51.9864L38.3885 54.1915C37.6868 55.4093 36.1326 55.8266 34.9172 55.1235C33.7018 54.4204 33.2853 52.8631 33.9871 51.6453L35.2577 49.4403Z', fill: '#FFB899' },
  { d: 'M2.88206 29.2418C3.58379 28.024 5.13796 27.6067 6.35339 28.3098C7.56882 29.0129 7.98525 30.5701 7.28352 31.788L4.74234 36.1981C4.04061 37.4159 2.48645 37.8331 1.27102 37.13C0.0555867 36.4269 -0.36085 34.8697 0.340879 33.6519L2.88206 29.2418Z', fill: '#F68E1E' },
  { d: 'M22.1444 21.2735C22.8461 20.0557 24.4003 19.6384 25.6157 20.3415C26.8311 21.0447 27.2476 22.6019 26.5459 23.8197L7.48697 56.8955C6.78524 58.1133 5.23108 58.5306 4.01565 57.8275C2.80022 57.1244 2.38378 55.5672 3.08551 54.3493L22.1444 21.2735Z', fill: '#F15D22' },
  { d: 'M25.7406 27.7637C26.4423 26.5459 27.9965 26.1287 29.2119 26.8318C30.4273 27.5349 30.8438 29.0921 30.142 30.3099L14.8949 56.7706C14.1932 57.9884 12.639 58.4057 11.4236 57.7026C10.2082 56.9995 9.79174 55.4422 10.4935 54.2244L25.7406 27.7637Z', fill: '#F68E1E' },
  { d: 'M34.2029 38.5396C34.9046 37.3218 36.4588 36.9046 37.6742 37.6077C38.8897 38.3108 39.3061 39.868 38.6044 41.0858L28.4396 58.7263C27.7379 59.9441 26.1837 60.3613 24.9683 59.6582C23.7529 58.9551 23.3365 57.3979 24.0382 56.1801L34.2029 38.5396Z', fill: '#F68E1E' },
  { d: 'M12.1956 25.8092C12.8973 24.5913 14.4515 24.1741 15.6669 24.8772C16.8823 25.5803 17.2987 27.1375 16.597 28.3553L6.43228 45.9958C5.73055 47.2136 4.17639 47.6309 2.96096 46.9277C1.74553 46.2246 1.32909 44.6674 2.03082 43.4496L12.1956 25.8092Z', fill: '#FFB899' },
];

type LetterPath = { d: string; fillRule?: 'evenodd' | 'nonzero'; gradIdx: number };
const LETTER_GROUPS: Array<{ key: string; paths: LetterPath[] }> = [
  { key: 'o',  paths: [{ d: 'M85.364 45.956C85.364 39.004 90.468 34.34 97.508 34.34C104.504 34.34 109.608 39.004 109.608 45.956C109.608 52.908 104.504 57.528 97.508 57.528C90.468 57.528 85.364 52.908 85.364 45.956ZM92.184 45.912C92.184 49.256 94.34 51.456 97.508 51.456C100.632 51.456 102.788 49.256 102.788 45.912C102.788 42.612 100.632 40.412 97.508 40.412C94.34 40.412 92.184 42.612 92.184 45.912Z', fillRule: 'evenodd', gradIdx: 9 }] },
  { key: 'n',  paths: [{ d: 'M122.512 57H115.736V35H122.116L122.556 37.288C123.92 35.396 126.428 34.296 129.288 34.296C134.524 34.296 137.56 37.64 137.56 43.404V57H130.784V45.032C130.784 42.26 129.244 40.456 126.912 40.456C124.228 40.456 122.512 42.216 122.512 44.944V57Z', gradIdx: 10 }] },
  { key: 'e',  paths: [{ d: 'M154.828 57.572C148.184 57.572 143.432 52.732 143.432 45.956C143.432 39.092 148.052 34.296 154.696 34.296C161.604 34.296 165.916 38.828 165.916 46V47.716L149.944 47.804C150.34 50.708 151.968 52.072 154.96 52.072C157.512 52.072 159.316 51.148 159.8 49.564H166.004C165.212 54.448 160.856 57.572 154.828 57.572ZM154.74 39.796C152.056 39.796 150.56 40.984 150.032 43.624H159.184C159.184 41.292 157.468 39.796 154.74 39.796Z', fillRule: 'evenodd', gradIdx: 11 }] },
  {
    key: 'a',
    paths: [
      { d: 'M216 60C218.209 60 220 58.2091 220 56C220 55.4674 219.894 54.9599 219.705 54.4951L219.706 54.4941L206.706 22.4941L206.705 22.4951C206.11 21.0322 204.677 20 203 20H189C186.791 20 185 21.7909 185 24C185 24.5328 185.105 25.041 185.294 25.5059L198.294 57.5059C198.889 58.9685 200.324 60 202 60H216ZM194.942 28H200.308L210.058 52H204.692L194.942 28Z', fillRule: 'evenodd', gradIdx: 0 },
      { d: 'M190 60C191.676 60 193.11 58.9683 193.705 57.5059L206.706 25.5059C206.895 25.0409 207 24.5329 207 24C207 21.7909 205.209 20 203 20H189C187.323 20 185.889 21.032 185.294 22.4951L172.294 54.4941C172.105 54.9588 172 55.4675 172 56C172 58.2091 173.791 60 176 60H190Z', fillRule: 'evenodd', gradIdx: 1 },
    ],
  },
  { key: 'd',  paths: [{ d: 'M234.792 57.572C228.456 57.572 224.364 53.084 224.364 46.132C224.364 39.136 228.544 34.296 235.232 34.296C237.96 34.296 240.556 35.396 241.832 37.024V23.824H248.608V57H242.228L241.876 54.184C240.688 56.208 237.96 57.572 234.792 57.572ZM236.42 51.368C239.588 51.368 241.788 49.168 241.788 45.868C241.788 42.568 239.588 40.368 236.42 40.368C233.208 40.368 231.184 42.612 231.184 45.868C231.184 49.124 233.208 51.368 236.42 51.368Z', fillRule: 'evenodd', gradIdx: 2 }] },
  { key: 'v',  paths: [{ d: 'M262.145 57L253.565 35H260.869L263.553 42.7C264.653 45.912 265.533 48.684 265.709 49.696C265.973 48.42 266.941 45.56 268.041 42.7L270.989 35H278.029L268.833 57H262.145Z', gradIdx: 3 }] },
  { key: 'a2', paths: [{ d: 'M288.545 57.572C283.881 57.572 280.977 54.844 280.977 50.532C280.977 46.484 283.837 43.976 289.117 43.58L295.277 43.096V42.744C295.277 40.588 293.957 39.444 291.537 39.444C288.677 39.444 287.137 40.544 287.137 42.524H281.505C281.505 37.552 285.597 34.296 291.889 34.296C298.269 34.296 301.877 37.86 301.877 44.152V57H295.893L295.453 54.096C294.749 56.12 291.845 57.572 288.545 57.572ZM290.921 52.556C293.517 52.556 295.321 51.28 295.321 48.772V47.584L291.889 47.892C288.941 48.156 287.885 48.816 287.885 50.224C287.885 51.808 288.853 52.556 290.921 52.556Z', fillRule: 'evenodd', gradIdx: 4 }] },
  { key: 'n2', paths: [{ d: 'M315.713 57H308.937V35H315.317L315.757 37.288C317.121 35.396 319.629 34.296 322.489 34.296C327.725 34.296 330.761 37.64 330.761 43.404V57H323.985V45.032C323.985 42.26 322.445 40.456 320.113 40.456C317.429 40.456 315.713 42.216 315.713 44.944V57Z', gradIdx: 5 }] },
  { key: 'c',  paths: [{ d: 'M336.633 45.912C336.633 39.136 341.297 34.296 347.897 34.296C354.409 34.296 358.721 37.86 359.161 43.624H352.341C351.857 41.424 350.493 40.368 348.161 40.368C345.301 40.368 343.453 42.524 343.453 45.912C343.453 49.432 345.169 51.5 348.073 51.5C350.449 51.5 351.901 50.4 352.341 48.244H359.161C358.721 53.788 354.233 57.572 348.073 57.572C341.121 57.572 336.633 52.952 336.633 45.912Z', gradIdx: 6 }] },
  { key: 'e2', paths: [{ d: 'M375.28 57.572C368.636 57.572 363.884 52.732 363.884 45.956C363.884 39.092 368.504 34.296 375.148 34.296C382.056 34.296 386.368 38.828 386.368 46V47.716L370.396 47.804C370.792 50.708 372.42 52.072 375.412 52.072C377.964 52.072 379.768 51.148 380.252 49.564H386.456C385.664 54.448 381.308 57.572 375.28 57.572ZM375.192 39.796C372.508 39.796 371.012 40.984 370.484 43.624H379.636C379.636 41.292 377.92 39.796 375.192 39.796Z', fillRule: 'evenodd', gradIdx: 7 }] },
  { key: 'd2', paths: [{ d: 'M401.82 57.572C395.484 57.572 391.392 53.084 391.392 46.132C391.392 39.136 395.572 34.296 402.26 34.296C404.988 34.296 407.584 35.396 408.86 37.024V23.824H415.636V57H409.256L408.904 54.184C407.716 56.208 404.988 57.572 401.82 57.572ZM403.448 51.368C406.616 51.368 408.816 49.168 408.816 45.868C408.816 42.568 406.616 40.368 403.448 40.368C400.236 40.368 398.212 42.612 398.212 45.868C398.212 49.124 400.236 51.368 403.448 51.368Z', fillRule: 'evenodd', gradIdx: 8 }] },
];

type LoginPhase = 'brandmark' | 'shift' | 'wordmark' | 'dismissing' | 'recenter' | 'pulse' | 'exit';

interface LoginIntroAnimationProps {
  onComplete: () => void;
}

export function LoginIntroAnimation({ onComplete }: LoginIntroAnimationProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<LoginPhase>('brandmark');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReduced) { onComplete(); return; }
    const t = [
      setTimeout(() => setPhase('shift'),      800),
      setTimeout(() => setPhase('wordmark'),   1050),
      setTimeout(() => setPhase('dismissing'), 2050),
      setTimeout(() => setPhase('recenter'),   2950),
      setTimeout(() => setPhase('pulse'),      3400),
      setTimeout(() => setPhase('exit'),       3950),
      setTimeout(() => onComplete(),           4250),
      setTimeout(() => setDone(true),          4500),
    ];
    return () => t.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (prefersReduced || done) return null;

  const isWordmarkVisible  = phase === 'shift' || phase === 'wordmark' || phase === 'dismissing';
  const isLetterEntry      = phase === 'wordmark';
  const isDismissing       = phase === 'dismissing';
  const isBrandmarkCentred = phase === 'brandmark' || phase === 'dismissing' || phase === 'recenter' || phase === 'pulse' || phase === 'exit';
  // Divider fades out after the wipe completes (~0.7s into dismissing)
  const isDividerVisible   = isWordmarkVisible && !isDismissing;
  const isPulse = phase === 'pulse';
  const isExit  = phase === 'exit';

  const containerX = isBrandmarkCentred ? BM_OFFSET_X : 0;

  const markAnimate = isPulse
    ? { scale: [1, 1.25, 1] as number[], opacity: 1 }
    : isExit
    ? { scale: 1, opacity: 0 }
    : { scale: 1, opacity: 1 };

  const markTransition = isPulse
    ? { duration: 0.22, times: [0, 0.4, 1], ease: 'easeInOut' as const }
    : isExit
    ? { duration: 0.35, ease: [0.4, 0, 1, 1] as [number, number, number, number] }
    : { duration: 0.4, ease: EASE };

  // Wipe clip in SVG space:
  // The letters span x=85 to x=416 in the viewBox.
  // To erase o→d (left→right), the visible window's LEFT edge sweeps from x=85 to x=416.
  // We do this with a rect that has a fixed large width (covers to the right of the SVG)
  // and animates its x from 85 (shows everything) to 416 (shows nothing).
  // The clip shows content TO THE RIGHT of x — so as x increases, letters are hidden left-first.
  // Duration + easing match the container x-slide so the divider appears to erase as it passes.
  const wipeX = isDismissing ? 416 : isLetterEntry ? 85 : 416;
  const wipeDuration = isDismissing ? 0.7 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden pointer-events-none"
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Circular pulse wave */}
      {isPulse && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 80, height: 80, border: '2px solid rgba(241, 93, 34, 0.6)' }}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        />
      )}

      {/* Shared anchor — both layers are absolutely positioned inside this so they
          share the same coordinate system. The outer flex centres this wrapper. */}
      <div style={{ position: 'relative', width: SVG_W, height: SVG_H, flexShrink: 0 }}>

        {/* LAYER 1 — stationary letters, never translates.
            Clip left-edge sweeps x=85→416 during dismissing, erasing o first. */}
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox="0 0 416 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            {[...Array(12)].map((_, i) => (
              <linearGradient
                key={i}
                id={`li-g${i}`}
                x1={i === 0 ? '196.5' : '85.364'}
                y1={i === 0 ? '23' : '40'}
                x2={i === 0 ? '212' : '415.636'}
                y2={i === 0 ? '63.5' : '40'}
                gradientUnits="userSpaceOnUse"
              >
                {i === 0 ? (
                  <>
                    <stop offset="0.326249" stopColor="#862C09" />
                    <stop offset="1" stopColor="#F15D22" />
                  </>
                ) : (
                  <>
                    <stop stopColor="#F68E1E" />
                    <stop offset="0.886575" stopColor="#F15D22" />
                  </>
                )}
              </linearGradient>
            ))}
            {/* x sweeps 85→416: reveals nothing to the right of x=416, erasing left-first */}
            <clipPath id="li-wipe">
              <motion.rect
                y={0} height={80} width={800}
                initial={{ x: 416 }}
                animate={{ x: wipeX }}
                transition={{ duration: wipeDuration, ease: EASE }}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#li-wipe)">
            {LETTER_GROUPS.map((group, gi) => {
              const entryDelay = gi * LETTER_ENTRY_DELAY;
              return (
                <motion.g
                  key={group.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: isLetterEntry || isDismissing ? 1 : 0,
                    y: isLetterEntry || isDismissing ? 0 : 6,
                  }}
                  transition={{
                    duration: isLetterEntry ? 0.28 : 0,
                    delay: isLetterEntry ? entryDelay : 0,
                    ease: EASE,
                  }}
                >
                  {group.paths.map((p, pi) => (
                    <g key={pi}>
                      <path d={p.d} fill="#F15D22" fillRule={p.fillRule ?? 'nonzero'} clipRule={p.fillRule ?? 'nonzero'} />
                      <path d={p.d} fill={`url(#li-g${p.gradIdx})`} fillOpacity={0.8} fillRule={p.fillRule ?? 'nonzero'} clipRule={p.fillRule ?? 'nonzero'} />
                    </g>
                  ))}
                </motion.g>
              );
            })}
          </g>
        </svg>

        {/* LAYER 2 — sliding brandmark + divider, no letters.
            Starts at x=0 (shifted left so wordmark is visible in layer 1),
            slides to x=BM_OFFSET_X (centred) during dismissing. */}
        <motion.div
          style={{ position: 'absolute', top: 0, left: 0 }}
          animate={{ x: containerX }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.div
            animate={markAnimate}
            transition={markTransition}
            style={{ transformOrigin: `${BM_CX}px 50%` }}
          >
            <svg
              width={SVG_W}
              height={SVG_H}
              viewBox="0 0 416 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {BM_PATHS.map((p, i) => (
                <motion.path
                  key={i}
                  d={p.d}
                  fill={p.fill}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  transition={{ duration: 0.38, delay: 0.08 + i * 0.055, ease: EASE }}
                />
              ))}

              <motion.rect
                x={64} y={0} width={4} height={80} rx={2} fill="#F15D22"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: isDividerVisible ? 1 : 0,
                  scaleY: isDismissing ? 1 : isDividerVisible ? 1 : 0,
                }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                transition={{ duration: 0.3, delay: isDismissing ? 0.2 : isWordmarkVisible ? 0.05 : 0, ease: EASE }}
              />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}

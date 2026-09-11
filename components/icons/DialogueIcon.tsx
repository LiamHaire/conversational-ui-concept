/**
 * DialogueIcon Component
 * Colorful dialogue/conversation icon
 */

'use client';

import { motion } from 'framer-motion';

interface DialogueIconProps {
  className?: string;
  width?: number;
  height?: number;
  animate?: boolean;
}

export function DialogueIcon({ className = '', width = 94, height = 96, animate = false }: DialogueIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 94 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left bar */}
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M39.352 20.8865C41.0295 21.8535 41.6042 23.9952 40.6358 25.6703L23.1014 55.9975C22.133 57.6726 19.9882 58.2463 18.3109 57.2794C16.6336 56.3124 16.0588 54.1705 17.0273 52.4957L34.5617 22.1682C35.5301 20.4934 37.6748 19.9195 39.352 20.8865Z"
        fill="#F15D22"
        animate={animate ? {
          fill: ['#F15D22', '#FFCBA4', '#F15D22']
        } : undefined}
        transition={animate ? {
          duration: 0.6,
          times: [0, 0.4, 1],
          ease: 'easeInOut',
          delay: 0.2,
          repeat: 0,
        } : undefined}
      />
      {/* Center bar */}
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.2971 28.4095C60.9744 29.3765 61.5491 31.5182 60.5807 33.193L39.5394 69.586C38.571 71.2609 36.4263 71.8348 34.749 70.8677C33.0716 69.9007 32.4969 67.759 33.4653 66.0841L54.5066 29.6912C55.475 28.0163 57.6197 27.4424 59.2971 28.4095Z"
        fill="#F68E1E"
        animate={animate ? {
          fill: ['#F68E1E', '#FFCBA4', '#F68E1E']
        } : undefined}
        transition={animate ? {
          duration: 0.6,
          times: [0, 0.4, 1],
          ease: 'easeInOut',
          delay: 0.4,
          repeat: 0,
        } : undefined}
      />
      {/* Right bar */}
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M78.4808 44.2505C79.6107 42.2966 79.167 39.9286 77.4896 38.9616C75.8123 37.9945 73.5366 38.7948 72.4069 40.7487L51.95 76.1306C50.8203 78.0848 51.264 80.4528 52.9415 81.4198C54.6187 82.3869 56.8944 81.5867 58.0241 79.6325L78.4808 44.2505Z"
        fill="#F68E1E"
        animate={animate ? {
          fill: ['#F68E1E', '#FFCBA4', '#F68E1E']
        } : undefined}
        transition={animate ? {
          duration: 0.6,
          times: [0, 0.4, 1],
          ease: 'easeInOut',
          delay: 0.6,
          repeat: 0,
        } : undefined}
      />
      {/* Background elements */}
      <path
        opacity="0.4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56.7542 18.8181C57.7226 17.1432 57.148 15.0015 55.4707 14.0344C53.7934 13.0674 51.6485 13.6413 50.6803 15.3162L19.1183 69.9056C18.1499 71.5805 18.7246 73.7221 20.4019 74.6892C22.0793 75.6562 24.224 75.0824 25.1924 73.4075L56.7542 18.8181ZM64.8402 46.85C65.8851 45.0431 65.3723 42.7941 63.6949 41.8271C62.0176 40.8601 59.8109 41.541 58.766 43.3482L47.4158 62.9795C46.3711 64.7865 46.8838 67.0352 48.5613 68.0022C50.2385 68.9693 52.4452 68.2885 53.4899 66.4814L64.8402 46.85ZM77.8295 59.4053C79.5069 60.3724 80.0816 62.514 79.1132 64.1889L75.6061 70.2544C74.6377 71.9295 72.493 72.5034 70.8158 71.5363C69.1383 70.5691 68.5636 68.4274 69.5323 66.7525L73.0391 60.687C74.0075 59.0122 76.1522 58.4383 77.8295 59.4053ZM24.5697 32.4575C25.5597 30.7453 25.0023 28.5733 23.3251 27.6063C21.6478 26.6393 19.4856 27.2434 18.4956 28.9556L14.9106 35.1562C13.9206 36.8686 14.4778 39.0405 16.1551 40.0076C17.8324 40.9746 19.9947 40.3705 20.9847 38.6582L24.5697 32.4575Z"
        fill="#F15D22"
      />
    </svg>
  );
}

"use client";

import { motion } from "framer-motion";

interface MusicPlayerProps {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  intensity: number;
}

export default function MusicPlayer({ isPlaying, isMuted, onTogglePlay, onToggleMute, intensity }: MusicPlayerProps) {
  // Map intensity to a glow and scale effect
  const glow = isPlaying ? `0 0 ${10 + intensity * 30}px rgba(255, 143, 201, ${0.3 + intensity * 0.4})` : "0 0 10px rgba(255, 143, 201, 0.1)";
  const scale = isPlaying ? 1 + intensity * 0.05 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-black/20 p-2 backdrop-blur-xl"
      style={{ boxShadow: glow }}
      whileHover={{ y: -2, backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <motion.button
        animate={{ scale }}
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        {isPlaying ? (
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
            <rect x="2" y="2" width="3" height="12" rx="1" />
            <rect x="9" y="2" width="3" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
            <path d="M3 2.5v11c0 .8.9 1.2 1.5.8l8-5.5c.6-.4.6-1.3 0-1.7l-8-5.5C3.9 1.3 3 1.7 3 2.5z" />
          </svg>
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggleMute}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-3"></path>
            <path d="M5 10a7 7 0 0 0 14 0"></path>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}

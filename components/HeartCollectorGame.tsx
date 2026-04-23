"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ZERIN_TRAITS = [
  "my calm",
  "your sweet smile",
  "my safe place",
  "your quiet presence",
  "the way you listen",
  "how you make everything softer",
  "your warmth",
  "your peaceful energy"
];

export default function HeartCollectorGame({ onWin }: { onWin: () => void }) {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; text: string; collected: boolean }>>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [revealedText, setRevealedText] = useState<string | null>(null);

  const goal = ZERIN_TRAITS.length;

  useEffect(() => {
    // Generate initial hearts positioned randomly across the screen
    const initialHearts = ZERIN_TRAITS.map((trait, index) => ({
      id: index,
      x: 15 + Math.random() * 70, // Keep them away from horizontal edges
      y: 15 + Math.random() * 70, // percentage
      text: trait,
      collected: false
    }));
    setHearts(initialHearts);
  }, []);

  const handleCollect = (id: number, text: string) => {
    setHearts(prev => prev.map(h => h.id === id ? { ...h, collected: true } : h));
    setRevealedText(text);
    
    const newCount = collectedCount + 1;
    setCollectedCount(newCount);

    if (newCount >= goal) {
      setTimeout(() => onWin(), 2500); // Wait a moment before winning
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-40"
    >
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center text-white/80">
        <h3 className="text-xl font-medium tracking-wide">Collect the pieces of my heart, Zerin</h3>
        <p className="text-sm opacity-60 mt-1">{collectedCount} / {goal} collected</p>
      </div>

      <AnimatePresence mode="wait">
        {revealedText && (
          <motion.div
            key={revealedText}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 text-2xl md:text-4xl font-serif text-pink-200 drop-shadow-[0_0_15px_rgba(255,183,213,0.8)] text-center w-[90vw] max-w-lg break-words leading-tight"
          >
            {revealedText}
          </motion.div>
        )}
      </AnimatePresence>

      {hearts.map((heart) => (
        <AnimatePresence key={heart.id}>
          {!heart.collected && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 0.8,
                y: [0, -15, 0],
                x: [0, Math.random() * 10 - 5, 0]
              }}
              exit={{ scale: 2, opacity: 0, filter: "blur(8px)" }}
              transition={{ 
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              onClick={() => handleCollect(heart.id, heart.text)}
              className="absolute text-4xl md:text-5xl cursor-pointer drop-shadow-[0_0_10px_rgba(255,100,150,0.5)]"
              style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            >
              💖
            </motion.button>
          )}
        </AnimatePresence>
      ))}
      
      {/* Soft background glow pulse on completion */}
      {collectedCount >= goal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-pink-400/10 mix-blend-screen pointer-events-none"
        />
      )}
    </motion.div>
  );
}

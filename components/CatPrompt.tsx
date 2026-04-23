"use client";

import { motion } from "framer-motion";

interface CatPromptProps {
  onStartGame: () => void;
}

export default function CatPrompt({ onStartGame }: CatPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="mt-12 flex flex-col items-center gap-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          whileHover={{ rotate: [-2, 2, -2, 2, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="h-32 w-32 overflow-hidden rounded-full border-4 border-pink-300/30 shadow-[0_0_30px_rgba(255,183,213,0.4)]"
        >
          <img
            src="https://media1.tenor.com/m/0A0I-r2KqKMAAAAC/cat-cute.gif"
            alt="Cozy Cat"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 40px rgba(255,140,200,0.6)" }}
        whileTap={{ scale: 0.95, boxShadow: "0 0 10px rgba(255,140,200,0.4)" }}
        onClick={onStartGame}
        className="relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-3.5 backdrop-blur-md shadow-[0_0_20px_rgba(255,140,200,0.3)] transition-all"
      >
        <span className="relative z-10 font-medium tracking-wide text-white/90">
          For you, Zerin 💫
        </span>
        <motion.div 
          className="absolute inset-0 z-0 bg-gradient-to-r from-pink-400/0 via-pink-300/20 to-pink-400/0"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function FinalLoveMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 3, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl text-center px-6 relative z-50"
    >
      <div className="space-y-8 font-serif tracking-wide text-white/90 drop-shadow-lg">
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="text-xl md:text-3xl leading-relaxed"
        >
          I don't think you realize how much of a safe haven you've become for me, Zerin.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 4 }}
          className="text-lg md:text-2xl leading-relaxed text-white/80"
        >
          In a world that is always moving so fast, you are the quiet, peaceful moment where I finally catch my breath. Just knowing you're there makes everything feel okay.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 7 }}
          className="text-lg md:text-2xl leading-relaxed text-white/80"
        >
          I love the comfort of our silence. I love the warmth you bring without even trying. You don't have to be anything other than exactly who you are, because who you are is everything I've ever wanted.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, delay: 10 }}
          className="text-2xl md:text-4xl text-pink-200 mt-12 drop-shadow-[0_0_20px_rgba(255,183,213,0.6)]"
        >
          You are more than enough, Zerin. 💖
        </motion.p>
      </div>
    </motion.div>
  );
}

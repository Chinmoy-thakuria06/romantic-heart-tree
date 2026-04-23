"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGE = `I don't think you realize how quietly you became the calm in my chaos...

Every little moment, every shared laugh, and even the simple silences have gently woven you into the most beautiful part of my days.

You make the world feel softer, warmer, and a lot more magical.

I promise to cherish this yes, to make you smile when you're tired, and to always look at you the way I do right now.

Thank you for choosing me. 💖`;

export default function LoveMessage({ onComplete }: { onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(MESSAGE.slice(0, index));
      if (index >= MESSAGE.length) {
        clearInterval(timer);
        setIsTyping(false);
        if (onComplete) {
          setTimeout(onComplete, 4500); // Give user 4.5s to read before triggering next step
        }
      }
    }, 70); // Adjusted typing speed for better sync with music

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="mx-auto w-full max-w-2xl text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/90 md:text-2xl md:leading-[2.5rem] drop-shadow-md font-serif tracking-wide">
          {displayed}
          {isTyping && <span className="animate-pulse">|</span>}
        </p>
      </motion.div>
    </div>
  );
}

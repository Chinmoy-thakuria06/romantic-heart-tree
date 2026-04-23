"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type AnimatedTextProps = {
  text: string;
  speed?: number;
  className?: string;
  prefix?: string;
  onFinished?: () => void;
};

export default function AnimatedText({
  text,
  speed = 26,
  className = "",
  prefix = "",
  onFinished
}: AnimatedTextProps) {
  const fullText = useMemo(() => `${prefix}${text}`, [prefix, text]);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplayed(fullText);
      onFinished?.();
      return;
    }

    const timer = window.setInterval(() => {
      index += 1;
      setDisplayed(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(timer);
        onFinished?.();
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [fullText, onFinished, speed]);

  return (
    <motion.p
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {displayed}
      <span className="inline-block w-[0.65ch] animate-pulse">▍</span>
    </motion.p>
  );
}

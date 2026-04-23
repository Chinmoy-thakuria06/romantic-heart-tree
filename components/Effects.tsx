"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type TrailHeart = {
  id: number;
  x: number;
  y: number;
  hue: number;
};

type EffectsProps = {
  celebrating: boolean;
};

export default function Effects({ celebrating }: EffectsProps) {
  const [trail, setTrail] = useState<TrailHeart[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [flares, setFlares] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      setTrail((curr) => {
        const next = [...curr, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY, hue: 325 + Math.random() * 35 }];
        return next.slice(-16);
      });
    };

    const onClick = (e: MouseEvent) => {
      setFlares((curr) => [...curr, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }].slice(-20));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!celebrating) return;
    const timer = window.setInterval(() => {
      setFlares((curr) => [
        ...curr,
        { id: Date.now() + Math.random(), x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight * 0.7 }
      ].slice(-24));
    }, 140);
    return () => window.clearInterval(timer);
  }, [celebrating]);

  const floatingStickers = useMemo(
    () => [
      { label: "✨", left: "6%", top: "12%", delay: 0 },
      { label: "💗", left: "88%", top: "14%", delay: 0.6 },
      { label: "🫶", left: "12%", top: "72%", delay: 1.2 },
      { label: "🌙", left: "83%", top: "68%", delay: 0.3 },
      { label: "🌸", left: "52%", top: "6%", delay: 0.9 }
    ],
    []
  );

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        <AnimatePresence>
          {trail.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0.9, scale: 0.5, x: item.x, y: item.y }}
              animate={{ opacity: 0, scale: 1.4, x: item.x + (Math.random() - 0.5) * 20, y: item.y - 18 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute text-lg"
              style={{ color: `hsl(${item.hue} 96% 76%)` }}
            >
              💗
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {flares.map((flare) => (
            <motion.div
              key={flare.id}
              initial={{ opacity: 0.85, scale: 0.3, x: flare.x, y: flare.y }}
              animate={{ opacity: 0, scale: 2.4, x: flare.x, y: flare.y - 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute h-5 w-5 rounded-full bg-white/70 blur-md"
            />
          ))}
        </AnimatePresence>

        {celebrating && (
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,177,222,0.24),transparent_45%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.38, 0.14] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
      </div>

      <div className="pointer-events-none fixed inset-0 z-30">
        {floatingStickers.map((sticker) => (
          <motion.div
            key={sticker.label}
            className="absolute text-2xl md:text-3xl drop-shadow-[0_0_16px_rgba(255,255,255,0.18)]"
            style={{ left: sticker.left, top: sticker.top }}
            animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: sticker.delay, ease: "easeInOut" }}
          >
            {sticker.label}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(255,146,207,0.16),transparent_55%)]"
        animate={celebrating ? { opacity: [0.15, 0.5, 0.18] } : { opacity: 0.1 }}
        transition={{ duration: 1.6, repeat: celebrating ? Infinity : 0 }}
      />
    </>
  );
}

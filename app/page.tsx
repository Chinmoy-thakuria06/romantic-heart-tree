"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimatedText from "@/components/AnimatedText";
import HeartTree from "@/components/HeartTree";
import ProposalScene from "@/components/ProposalScene";
import Effects from "@/components/Effects";
import { introLines, midLines } from "@/lib/messages";

const scenes = ["intro", "mid", "proposal"] as const;
type Scene = (typeof scenes)[number];

export default function Page() {
  const [scene, setScene] = useState<Scene>("intro");
  const [treeBurstSeed, setTreeBurstSeed] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const introRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const proposalRef = useRef<HTMLDivElement | null>(null);

  const sceneRefs = useMemo(
    () => ({ intro: introRef, mid: midRef, proposal: proposalRef }),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.getAttribute("data-scene") as Scene | null;
        if (id && scenes.includes(id)) setScene(id);
      },
      { threshold: [0.2, 0.35, 0.55, 0.75] }
    );

    [introRef.current, midRef.current, proposalRef.current].forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (target: Scene) => {
    sceneRefs[target].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleYes = () => {
    setCelebrating(true);
    setTreeBurstSeed((v) => v + 1);
    window.setTimeout(() => setCelebrating(false), 4600);
  };

  const handleTreeClick = () => {
    setTreeBurstSeed((v) => v + 1);
  };

  return (
    <main className="cursor-none relative min-h-screen overflow-hidden bg-romantic-gradient">
      <Effects celebrating={celebrating} />

      <div className="fixed inset-0 -z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,198,225,0.16),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(141,177,255,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.22))]" />
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {scene === "intro" && (
                <motion.div
                  key="intro"
                  ref={introRef}
                  data-scene="intro"
                  className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="mb-3 text-xs tracking-[0.35em] text-white/55 uppercase">A little note from my heart</p>
                  <div className="space-y-3 text-xl leading-9 md:text-2xl">
                    {introLines.map((line) => (
                      <AnimatedText key={line} text={line} speed={24} className="text-white/92" />
                    ))}
                  </div>
                  <button
                    onClick={() => scrollTo("mid")}
                    className="mt-8 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/15"
                  >
                    Continue the story ↓
                  </button>
                </motion.div>
              )}

              {scene === "mid" && (
                <motion.div
                  key="mid"
                  ref={midRef}
                  data-scene="mid"
                  className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="mb-3 text-xs tracking-[0.35em] text-white/55 uppercase">Somewhere between calm and magic</p>
                  <div className="space-y-3 text-xl leading-9 md:text-2xl">
                    {midLines.map((line) => (
                      <AnimatedText key={line} text={line} speed={24} className="text-white/92" />
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => scrollTo("proposal")}
                      className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/15"
                    >
                      Show me the last line ↓
                    </button>
                    <button
                      onClick={() => scrollTo("intro")}
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                    >
                      Back to the beginning
                    </button>
                  </div>
                </motion.div>
              )}

              {scene === "proposal" && (
                <motion.div
                  key="proposal"
                  ref={proposalRef}
                  data-scene="proposal"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ProposalScene onYes={handleYes} onNotSure={() => handleTreeClick()} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              className="mb-4 flex items-center justify-between text-xs tracking-[0.3em] text-white/55 uppercase"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>Dreamy date invite</span>
              <span>{scene === "intro" ? "01" : scene === "mid" ? "02" : "03"}</span>
            </motion.div>

            <motion.div
              className="soft-panel romantic-glow rounded-[2rem] p-3 md:p-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <HeartTree burstSeed={treeBurstSeed} onTreeClick={handleTreeClick} />
            </motion.div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/75">
              <div className="soft-panel rounded-2xl px-4 py-3">Click the tree for a heart burst</div>
              <div className="soft-panel rounded-2xl px-4 py-3">Scroll for the story</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16 md:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-3">
          <motion.div
            className="soft-panel rounded-[2rem] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="mb-2 text-xs tracking-[0.3em] text-white/55 uppercase">Soft atmosphere</p>
            <p className="text-white/85 leading-7">
              Pink and violet gradients, drifting sparkles, glowing hearts, and a calm night sky keep the whole experience dreamy and warm.
            </p>
          </motion.div>

          <motion.div
            className="soft-panel rounded-[2rem] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="mb-2 text-xs tracking-[0.3em] text-white/55 uppercase">Playful behavior</p>
            <p className="text-white/85 leading-7">
              The “Not sure” path stays kind and respectful. It gives a gentle nudge, then lets the user decide without trapping them.
            </p>
          </motion.div>

          <motion.div
            className="soft-panel rounded-[2rem] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <p className="mb-2 text-xs tracking-[0.3em] text-white/55 uppercase">A real moment</p>
            <p className="text-white/85 leading-7">
              This keeps the ask-out personal, cute, and memorable — more like a little love scene than a generic landing page.
            </p>
          </motion.div>
        </div>
      </section>

      {celebrating && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.82, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="soft-panel romantic-glow max-w-xl rounded-[2rem] px-6 py-8 text-center md:px-10"
          >
            <div className="text-5xl">💖</div>
            <h3 className="mt-4 text-2xl font-semibold md:text-4xl">A yes that feels like a little star going off.</h3>
            <p className="mt-4 text-lg leading-8 text-white/85 md:text-xl">
              You just made my heart do something illegal ❤️
              <br />
              I promise I’ll make that yes worth it.
            </p>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

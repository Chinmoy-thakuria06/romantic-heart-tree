"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AnimatedText from "@/components/AnimatedText";
import HeartTree from "@/components/HeartTree";
import ProposalScene from "@/components/ProposalScene";
import Effects from "@/components/Effects";
import { introLines, midLines } from "@/lib/messages";

import YesExperience from "@/components/YesExperience";

const scenes = ["intro", "mid", "proposal"] as const;
type Scene = (typeof scenes)[number];

export default function Page() {
  const [scene, setScene] = useState<Scene>("intro");
  const [treeBurstSeed, setTreeBurstSeed] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const handleYes = () => {
    setCelebrating(true);
  };

  const handleTreeClick = () => {
    setTreeBurstSeed((v) => v + 1);
  };

  if (celebrating) {
    return <YesExperience />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-romantic-gradient">
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
                  className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-3 text-xs tracking-[0.35em] text-white/55 uppercase">A little note from my heart</p>
                  <div className="space-y-3 text-xl leading-9 md:text-2xl">
                    {introLines.map((line) => (
                      <AnimatedText key={line} text={line} speed={24} className="text-white/92" />
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setScene("mid")}
                    className="mt-8 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/15"
                  >
                    Continue the story →
                  </motion.button>
                </motion.div>
              )}

              {scene === "mid" && (
                <motion.div
                  key="mid"
                  className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-3 text-xs tracking-[0.35em] text-white/55 uppercase">Somewhere between calm and magic</p>
                  <div className="space-y-3 text-xl leading-9 md:text-2xl">
                    {midLines.map((line) => (
                      <AnimatedText key={line} text={line} speed={24} className="text-white/92" />
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setScene("proposal")}
                      className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/15"
                    >
                      Show me the last line →
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setScene("intro")}
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                    >
                      Back to the beginning
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {scene === "proposal" && (
                <motion.div
                  key="proposal"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
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
              <div className="soft-panel rounded-2xl px-4 py-3">Click to reveal the story</div>
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
              The "Not sure" path stays kind and respectful. It gives a gentle nudge, then lets the user decide without trapping them.
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
    </main>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { gentleNotSureLines, proposalLines, yesLines } from "@/lib/messages";

type ProposalSceneProps = {
  onYes: () => void;
  onNotSure: () => void;
};

export default function ProposalScene({ onYes, onNotSure }: ProposalSceneProps) {
  const [branch, setBranch] = useState<"proposal" | "soft" | "later">("proposal");
  const [messageIndex, setMessageIndex] = useState(0);

  const notSureMessage = useMemo(
    () => gentleNotSureLines[messageIndex % gentleNotSureLines.length],
    [messageIndex]
  );

  const primaryButtons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onYes}
        className="rounded-full border border-white/20 bg-white/90 px-7 py-3 font-semibold text-slate-950 shadow-[0_0_26px_rgba(255,170,218,0.38)] transition"
      >
        YES 💖
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setMessageIndex((v) => v + 1);
          setBranch("soft");
          onNotSure();
        }}
        className="rounded-full border border-white/15 bg-white/10 px-7 py-3 font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/15"
      >
        NOT SURE 🤭
      </motion.button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs tracking-[0.28em] text-white/70 uppercase">
          A gentle question
        </div>

        <AnimatePresence mode="wait">
          {branch === "proposal" && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
                The part where I ask, a little nervously, but very sincerely…
              </h2>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/85 md:text-xl">
                {proposalLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {primaryButtons}
            </motion.div>
          )}

          {branch === "soft" && (
            <motion.div
              key="soft"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <div className="space-y-3 text-lg leading-8 text-white/85 md:text-xl">
                <p>{notSureMessage}</p>
                <p>No pressure at all — I just wanted this to feel sweet, honest, and easy to say yes to.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBranch("proposal")}
                  className="rounded-full border border-white/20 bg-white/90 px-7 py-3 font-semibold text-slate-950 shadow-[0_0_26px_rgba(255,170,218,0.38)]"
                >
                  TRY AGAIN 💫
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBranch("later")}
                  className="rounded-full border border-white/15 bg-white/10 px-7 py-3 font-semibold text-white/90 backdrop-blur-md"
                >
                  OKAY MAYBE LATER
                </motion.button>
              </div>
            </motion.div>
          )}

          {branch === "later" && (
            <motion.div
              key="later"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">That is completely okay.</h2>
              <div className="mt-6 space-y-3 text-lg leading-8 text-white/85 md:text-xl">
                <p>I still wanted to make you something warm, dreamy, and full of care.</p>
                <p>Whenever you are ready, this little sky will still be here.</p>
              </div>

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBranch("proposal")}
                  className="rounded-full border border-white/20 bg-white/90 px-7 py-3 font-semibold text-slate-950 shadow-[0_0_26px_rgba(255,170,218,0.38)]"
                >
                  Back to the moment ✨
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/70">
          <AnimatePresence mode="wait">
            <motion.p
              key={branch}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {branch === "proposal" ? "A calm yes is the sweetest yes." : branch === "soft" ? "Gentle honesty always looks beautiful." : "No rush, no pressure, just warmth."}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-3 text-center text-sm text-white/60 sm:grid-cols-2">
        {yesLines.map((line) => (
          <div key={line} className="soft-panel rounded-2xl px-4 py-3">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

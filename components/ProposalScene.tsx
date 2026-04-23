"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  escalatingNoLines,
  noButtonLabels,
  catGifUrls,
  proposalLines,
  yesLines,
  quizQuestions,
} from "@/lib/messages";

type ProposalSceneProps = {
  onYes: () => void;
  onNotSure: () => void;
};

/* ──────────────── CATCH HEARTS MINI-GAME ──────────────── */
function CatchHeartsGame({ onWin }: { onWin: () => void }) {
  const [hearts, setHearts] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);
  const [caught, setCaught] = useState(0);
  const goal = 8;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHearts((prev) => {
        const next = [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 70,
            emoji: ["💖", "💗", "💕", "❤️", "🩷", "💘", "😻"][
              Math.floor(Math.random() * 7)
            ],
          },
        ];
        return next.slice(-14);
      });
    }, 600);
    return () => window.clearInterval(interval);
  }, []);

  const catchHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
    const next = caught + 1;
    setCaught(next);
    if (next >= goal) onWin();
  };

  return (
    <div
      ref={containerRef}
      className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30"
    >
      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-md">
        💖 {caught} / {goal} — Catch them all!
      </div>
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.button
            key={heart.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{
              duration: 0.3,
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute cursor-pointer text-2xl transition-transform hover:scale-150"
            style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
            onClick={() => catchHeart(heart.id)}
          >
            {heart.emoji}
          </motion.button>
        ))}
      </AnimatePresence>
      {caught >= goal && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You caught them all! That means YES! 💖
        </motion.div>
      )}
    </div>
  );
}

/* ──────────────── LOVE QUIZ MINI-GAME ──────────────── */
function LoveQuiz({ onComplete }: { onComplete: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const q = quizQuestions[qIndex];

  const handleOption = () => {
    setShowAnswer(true);
    window.setTimeout(() => {
      setShowAnswer(false);
      if (qIndex + 1 >= quizQuestions.length) {
        onComplete();
      } else {
        setQIndex((i) => i + 1);
      }
    }, 1800);
  };

  return (
    <motion.div
      className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="mb-1 text-xs tracking-[0.25em] text-white/50 uppercase">
        Love Quiz 💕 — Question {qIndex + 1}/{quizQuestions.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="mb-4 text-lg font-semibold">{q.question}</h4>
          {!showAnswer ? (
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOption}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white/90 transition hover:bg-white/20"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl bg-white/10 px-4 py-3 text-center text-base"
            >
              {q.answer}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ──────────────── MAIN PROPOSAL SCENE ──────────────── */
export default function ProposalScene({
  onYes,
  onNotSure,
}: ProposalSceneProps) {
  const [noCount, setNoCount] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCatchGame, setShowCatchGame] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMessage = useMemo(
    () => escalatingNoLines[Math.min(noCount - 1, escalatingNoLines.length - 1)],
    [noCount]
  );

  const currentCatGif = useMemo(
    () => catGifUrls[(noCount - 1) % catGifUrls.length],
    [noCount]
  );

  const noLabel = useMemo(
    () => noButtonLabels[Math.min(noCount, noButtonLabels.length - 1)],
    [noCount]
  );

  // YES button grows, NO button shrinks
  const yesScale = Math.min(1 + noCount * 0.12, 2.2);
  const noScale = Math.max(1 - noCount * 0.07, 0.3);
  const noButtonHidden = noCount >= 16;

  const dodgeNo = useCallback(() => {
    if (noCount < 5 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setNoPos({
      x: Math.random() * (rect.width - 120),
      y: Math.random() * Math.min(rect.height - 50, 300),
    });
  }, [noCount]);

  const handleNo = () => {
    const next = noCount + 1;
    setNoCount(next);
    onNotSure();

    // Unlock games at certain thresholds
    if (next === 4) setShowQuiz(true);
    if (next === 7) setShowCatchGame(true);
  };

  const handleGameWin = () => {
    setShowCatchGame(false);
    onYes();
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    onYes();
  };

  return (
    <div className="mx-auto w-full max-w-3xl" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="soft-panel romantic-glow rounded-[2rem] p-6 md:p-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs tracking-[0.28em] text-white/70 uppercase">
          {noCount === 0
            ? "A gentle question"
            : noCount < 5
              ? "A slightly less gentle question"
              : noCount < 10
                ? "AN URGENT QUESTION"
                : "THE FINAL QUESTION 🔥"}
        </div>

        {/* ── Main proposal text ── */}
        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
          {noCount === 0
            ? "The part where I ask, a little nervously, but very sincerely…"
            : noCount < 8
              ? "I'm asking again… with even more love this time…"
              : "I WILL KEEP ASKING UNTIL THE STARS BURN OUT ✨"}
        </h2>

        <div className="mt-6 space-y-3 text-lg leading-8 text-white/85 md:text-xl">
          {proposalLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* ── Escalating message after pressing NO ── */}
        {noCount > 0 && (
          <motion.div
            key={`msg-${noCount}`}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-5 rounded-2xl border border-pink-400/20 bg-pink-500/10 px-5 py-4 text-base"
          >
            <p className="mb-2 text-white/90">{currentMessage}</p>
            <p className="text-sm text-white/50">
              Times you&apos;ve said no: {noCount} 😤
            </p>
          </motion.div>
        )}

        {/* ── Cat GIF reaction ── */}
        {noCount > 0 && (
          <motion.div
            key={`cat-${noCount}`}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="mt-5 overflow-hidden rounded-2xl border border-white/10"
          >
            <img
              src={currentCatGif}
              alt="Cute cat reaction"
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="bg-black/40 px-4 py-2 text-center text-sm text-white/70">
              {noCount < 5
                ? "This cat believes in us 🐱💕"
                : noCount < 10
                  ? "Even this cat is begging you to say yes 😿"
                  : "THE CAT HAS HAD ENOUGH. SAY YES. 🐱‍👤"}
            </div>
          </motion.div>
        )}

        {/* ── Floating cat stickers that increase with no count ── */}
        {noCount >= 3 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: Math.min(noCount, 12) }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  y: [0, -6, 0],
                }}
                transition={{
                  delay: i * 0.08,
                  y: {
                    duration: 1.5 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="text-2xl"
              >
                {["🐱", "😺", "😸", "😻", "🐈", "😽", "🐾", "🙀", "😹", "😿", "🐈‍⬛", "🐱‍👤"][i % 12]}
              </motion.span>
            ))}
          </div>
        )}

        {/* ── YES / NO buttons ── */}
        <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <motion.button
            whileHover={{ scale: yesScale * 1.08, y: -3 }}
            whileTap={{ scale: yesScale * 0.95 }}
            animate={{
              scale: yesScale,
              boxShadow:
                noCount > 3
                  ? [
                      "0 0 20px rgba(255,170,218,0.3)",
                      "0 0 40px rgba(255,170,218,0.6)",
                      "0 0 20px rgba(255,170,218,0.3)",
                    ]
                  : "0 0 26px rgba(255,170,218,0.38)",
            }}
            transition={
              noCount > 3
                ? { boxShadow: { duration: 1.2, repeat: Infinity } }
                : {}
            }
            onClick={onYes}
            className="rounded-full border border-white/20 bg-white/90 px-7 py-3 font-bold text-slate-950 shadow-[0_0_26px_rgba(255,170,218,0.38)] transition"
          >
            YES 💖
          </motion.button>

          {!noButtonHidden && (
            <motion.button
              animate={{ scale: noScale }}
              whileTap={{ scale: noScale * 0.9 }}
              onMouseEnter={dodgeNo}
              onClick={handleNo}
              className="rounded-full border border-white/15 bg-white/10 px-7 py-3 font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/15"
              style={
                noPos
                  ? {
                      position: "absolute",
                      left: noPos.x,
                      top: noPos.y,
                      zIndex: 10,
                    }
                  : {}
              }
            >
              {noLabel}
            </motion.button>
          )}

          {noButtonHidden && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/50"
            >
              The NO button gave up and left 👋😂
            </motion.p>
          )}
        </div>

        {/* ── Pulsing "SAY YES" overlay at high no counts ── */}
        {noCount >= 12 && (
          <motion.div
            className="mt-6 text-center"
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <p className="text-3xl font-bold tracking-wide md:text-5xl">
              SAY YES 💖💖💖
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* ── LOVE QUIZ (unlocks at noCount >= 4) ── */}
      {showQuiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-3 text-center text-sm text-white/60">
            🎮 You unlocked a mini-game! Complete the Love Quiz to prove your love 💕
          </div>
          <LoveQuiz onComplete={handleQuizComplete} />
        </motion.div>
      )}

      {/* ── CATCH HEARTS GAME (unlocks at noCount >= 7) ── */}
      {showCatchGame && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="mb-3 text-center text-sm text-white/60">
            🎮 NEW GAME UNLOCKED! Catch all the hearts to say YES! 💖
          </div>
          <CatchHeartsGame onWin={handleGameWin} />
        </motion.div>
      )}

      {/* ── Bottom cards ── */}
      <div className="mt-6 grid gap-3 text-center text-sm text-white/60 sm:grid-cols-2">
        {yesLines.map((line) => (
          <div key={line} className="soft-panel rounded-2xl px-4 py-3">
            {line}
          </div>
        ))}
      </div>

      {/* ── Extra fun stickers bar ── */}
      {noCount >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
        >
          <span className="text-sm text-white/50">Sticker vibes:</span>
          {["💌", "🧸", "🌹", "🦋", "🎀", "🫧", "🪻", "🍓"].map(
            (s, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 1.2 + i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-xl"
              >
                {s}
              </motion.span>
            )
          )}
        </motion.div>
      )}
    </div>
  );
}

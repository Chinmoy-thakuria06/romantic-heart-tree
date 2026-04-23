"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import SakuraParticles from "./SakuraParticles";
import LoveMessage from "./LoveMessage";
import MusicPlayer from "./MusicPlayer";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

export default function YesExperience() {
  const [playMusic, setPlayMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  // Audio handling
  const { intensity, isPlaying } = useAudioAnalyzer("/music/love.mp3", playMusic, isMuted);

  useEffect(() => {
    // Start music slightly after component mounts to allow for initial fade
    const timer = setTimeout(() => {
      setPlayMusic(true);
    }, 1500);
    
    // Show message after the blur transition
    const msgTimer = setTimeout(() => {
      setShowMessage(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(msgTimer);
    };
  }, []);

  // Intensity-based glow
  const backgroundStyle = {
    background: `linear-gradient(180deg, rgba(20, 15, 30, 0.9) 0%, rgba(30, 20, 45, 0.95) 100%)`,
    boxShadow: `inset 0 0 ${100 + intensity * 150}px rgba(255, 140, 200, ${0.1 + intensity * 0.2})`
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px) brightness(1.5)" }}
      animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      {/* Dreamy Sakura Sky Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,183,213,0.15),transparent_50%)]" />
      <div 
        className="absolute inset-0 -z-10 opacity-30 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,120,180,${intensity * 0.4}) 0%, transparent 60%)`
        }}
      />

      {/* 3D Sakura Particles */}
      <div className="absolute inset-0 -z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#ffb7d5" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#b8a0ff" />
          <SakuraParticles count={250} intensity={intensity} />
        </Canvas>
      </div>

      {/* Cinematic Content */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="z-10 flex flex-col items-center p-8 backdrop-blur-[2px]"
          >
            <LoveMessage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts based on beat */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-3xl opacity-20 blur-[1px]"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 100,
              scale: 0.5
            }}
            animate={{ 
              y: -100,
              x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
              scale: 0.5 + intensity * 0.8 // Pulse on beat
            }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {i % 2 === 0 ? "🌸" : "💖"}
          </motion.div>
        ))}
      </div>

      {/* Custom Music Controls */}
      <MusicPlayer 
        isPlaying={isPlaying} 
        isMuted={isMuted}
        onTogglePlay={() => setPlayMusic(!playMusic)}
        onToggleMute={() => setIsMuted(!isMuted)}
        intensity={intensity}
      />
    </motion.div>
  );
}

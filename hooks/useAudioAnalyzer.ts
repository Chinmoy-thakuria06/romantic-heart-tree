import { useEffect, useRef, useState } from "react";

export function useAudioAnalyzer(url: string, play: boolean, muted: boolean = false) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.crossOrigin = "anonymous";
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [url]);

  // Handle play/pause and fade
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (play) {
      // Setup Web Audio API on first play
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        
        gainNodeRef.current = audioContextRef.current.createGain();
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        dataArrayRef.current = new Uint8Array(analyzerRef.current.frequencyBinCount);
      }
      
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      audioRef.current.play().then(() => {
        setIsPlaying(true);
        // Fade in
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
          gainNodeRef.current.gain.linearRampToValueAtTime(muted ? 0 : 1, audioContextRef.current!.currentTime + 2.5);
        }
      }).catch(e => console.error("Audio playback failed", e));
      
    } else {
      // Fade out and pause
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1.5);
        
        setTimeout(() => {
          if (audioRef.current && !play) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        }, 1600);
      } else if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [play, muted]);
  
  // Handle mute toggle
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(muted ? 0 : 1, audioContextRef.current.currentTime, 0.5);
    }
  }, [muted]);

  // Update intensity for beat-sync
  useEffect(() => {
    let animationFrame: number;
    
    const updateIntensity = () => {
      if (analyzerRef.current && dataArrayRef.current && isPlaying) {
        // @ts-ignore - TS typing mismatch for Uint8Array
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
        // Focus on lower frequencies (bass/beats)
        let sum = 0;
        const limit = 20; // Lower bins
        for (let i = 0; i < limit; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / limit;
        // Normalize
        const normalized = Math.max(0, (avg - 100) / 155); 
        setIntensity(normalized);
      }
      animationFrame = requestAnimationFrame(updateIntensity);
    };
    
    if (isPlaying) {
      updateIntensity();
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying]);

  return { intensity, isPlaying };
}

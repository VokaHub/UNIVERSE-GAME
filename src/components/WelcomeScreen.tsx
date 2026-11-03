import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Navigation, Globe } from 'lucide-react';
import { WELCOME_CONFIG, MISSION_METADATA } from '../data/missionConfig';
import { Moon3D } from './Moon3D';
import { sfx } from '../utils/audio';

interface WelcomeScreenProps {
  onStartGame: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  const handleStart = () => {
    sfx.transition();
    onStartGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-screen h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between select-none"
    >
      {/* 1. Fondo: Luna 3D Interactiva Three.js con rotación y zoom */}
      <div className="absolute inset-0 z-0">
        <Moon3D />
      </div>

      {/* Scrim cinematográfico sutil para garantizar contraste tipográfico perfecto */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/50" />

      {/* 2. Barra Superior: Identificación del Equipo y Ubicación */}
      <div className="relative z-20 px-6 py-5 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">
          <Globe className="w-4 h-4" />
          <span>{WELCOME_CONFIG.teamName} PRESENTA</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>OBJETIVO: POLO SUR LUNAR (89.9° S)</span>
        </div>
      </div>

      {/* 3. Zona Central / Inferior: Título Principal, Subtítulo y CTA */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 pb-12 text-center flex flex-col items-center">
        {/* Subtítulo temático */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xs sm:text-sm font-mono tracking-[0.25em] text-cyan-300 uppercase font-semibold mb-2"
        >
          {WELCOME_CONFIG.subtitle}
        </motion.div>

        {/* Gran Título del Juego */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-6xl sm:text-8xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_35px_rgba(34,211,238,0.25)]"
        >
          {WELCOME_CONFIG.gameTitle}
        </motion.h1>

        {/* Frase gancho de la misión */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-4 text-base sm:text-xl text-slate-200 font-medium max-w-lg leading-relaxed"
        >
          «{WELCOME_CONFIG.missionTagline}»
        </motion.p>

        {/* Botón Principal: EMPEZAR A JUGAR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8"
        >
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] active:scale-95 transition-all cursor-pointer border border-white/40"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{WELCOME_CONFIG.ctaButton}</span>
          </button>
        </motion.div>

        {/* Metadatos sutiles de la misión */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="mt-6 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400"
        >
          <span>SIMULACIÓN TÁCTICA</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>MISIÓN 48 HORAS</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>POLO SUR LUNAR</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

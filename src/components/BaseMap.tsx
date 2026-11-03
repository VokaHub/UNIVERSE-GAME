import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, ArrowRight, Sprout } from 'lucide-react';
import { ASSET_IMAGES } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface BaseMapProps {
  hasIncident: boolean;
  isResolved: boolean;
  onSelectGreenhouse: () => void;
  onOpenControlPanel: () => void;
}

export const BaseMap: React.FC<BaseMapProps> = ({
  hasIncident,
  isResolved,
  onSelectGreenhouse,
}) => {
  const isGreenhouseError = hasIncident && !isResolved;

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.08, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[calc(100vh-49px)] overflow-hidden bg-slate-950 select-none"
    >
      {/* 1. Escenario 3D Panorámico de Fondo - Máximo Protagonismo */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.lunarBase}
          alt="Base Lunar OUTPOST"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Scrim sutil mínimo sólo para legibilidad de cabecera */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />
      </div>

      {/* 2. Alerta de Esquina Simple y Visual (Sin párrafos descriptivos) */}
      <div className="absolute top-4 right-4 z-20">
        {isGreenhouseError ? (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.transition();
              onSelectGreenhouse();
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-rose-950/80 animate-pulse border border-rose-400"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>INVERNADERO: 34 °C</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        ) : isResolved ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold backdrop-blur-md shadow-lg"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>INCIDENTE RESUELTO</span>
          </motion.div>
        ) : null}
      </div>

      {/* 3. Marcador Interactivo Táctico sobre el Invernadero */}
      <div
        className="absolute z-20"
        style={{ left: '60%', top: '48%' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Pulso de advertencia si hay error */}
          {isGreenhouseError && (
            <span className="absolute -inset-3 rounded-full bg-rose-500/40 animate-ping" />
          )}

          {/* Botón de selección interactivo */}
          <button
            onClick={() => {
              sfx.transition();
              onSelectGreenhouse();
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all cursor-pointer shadow-2xl active:scale-95 ${
              isGreenhouseError
                ? 'bg-rose-600 hover:bg-rose-500 border-white text-white shadow-rose-900/80'
                : 'bg-emerald-600 hover:bg-emerald-500 border-white text-white shadow-emerald-900/60'
            }`}
            aria-label="Entrar al Invernadero"
          >
            {isGreenhouseError ? (
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            ) : (
              <Sprout className="w-4 h-4" />
            )}

            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black tracking-wider uppercase">
                INVERNADERO
              </span>
              <span className="text-[10px] font-mono font-bold leading-none">
                {isGreenhouseError ? '34 °C · ERROR' : '25 °C · OK'}
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

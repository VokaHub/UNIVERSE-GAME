import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, ArrowRight, Sprout, Tablet } from 'lucide-react';
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
  onOpenControlPanel,
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
      {/* 1. Escenario Panorámico de Fondo - Máximo Protagonismo */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.lunarBase}
          alt="Base Lunar OUTPOST - Misión Polo Sur (Equipo UNIVERSE)"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Scrim sutil mínimo sólo para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />
      </div>

      {/* 2. Alerta de Esquina PUREMENTE INFORMATIVA (Sin botón de navegación duplicado) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        {isGreenhouseError ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-rose-950/90 border border-rose-500/80 text-white font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span className="font-mono text-rose-200">ALERTA: INVERNADERO (34 °C)</span>
          </motion.div>
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

      {/* 3. ÚNICO ACCESO AL INVERNADERO: Marcador Interactivo en el Domo del Mapa */}
      <div
        className="absolute z-20"
        style={{ left: '60%', top: '48%' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Pulso de advertencia si hay error */}
          {isGreenhouseError && (
            <span className="absolute -inset-4 rounded-full bg-rose-500/40 animate-ping pointer-events-none" />
          )}

          {/* Botón único de selección interactivo sobre el mapa */}
          <button
            onClick={() => {
              sfx.transition();
              onSelectGreenhouse();
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 transition-all cursor-pointer shadow-2xl active:scale-95 ${
              isGreenhouseError
                ? 'bg-rose-600 hover:bg-rose-500 border-white text-white shadow-rose-900/80 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 border-white text-white shadow-emerald-900/60'
            }`}
            aria-label="Entrar al Invernadero"
          >
            {isGreenhouseError ? (
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            ) : (
              <Sprout className="w-5 h-5" />
            )}

            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-wider uppercase">
                INVERNADERO
              </span>
              <span className="text-[10px] font-mono font-bold leading-none opacity-90">
                {isGreenhouseError ? '34 °C · TOCAR PARA ENTRAR' : '25 °C · OPERATIVO'}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </div>

      {/* 4. ÚNICO ACCESO AL PANEL DE CONTROL: Botón Tableta en la Esquina Inferior Derecha */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => {
            sfx.click();
            onOpenControlPanel();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-950/60 active:scale-95 transition-all border border-white/30 cursor-pointer"
        >
          <Tablet className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          <span className="tracking-wide">CONTROL DE MISIÓN</span>
        </button>
      </div>
    </motion.div>
  );
};

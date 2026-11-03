import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Wind, Droplets, Sprout, Home, ArrowRight, ShieldCheck, Sun, Activity } from 'lucide-react';
import { ResourceState } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface ControlPanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceState;
  greenhouseStatus: 'ERROR' | 'OPERATIVO';
  onNavigateToGreenhouse: () => void;
}

export const ControlPanelDrawer: React.FC<ControlPanelDrawerProps> = ({
  isOpen,
  onClose,
  resources,
  greenhouseStatus,
  onNavigateToGreenhouse,
}) => {
  const isError = greenhouseStatus === 'ERROR';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo atenuado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Panel Flotante Compacto */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[460px] z-50 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl backdrop-blur-xl text-white p-4 sm:p-5 select-none"
          >
            {/* Cabecera del Panel */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm sm:text-base font-extrabold tracking-wide font-mono uppercase text-cyan-300">
                  PANEL DE CONTROL
                </h3>
              </div>

              <button
                onClick={() => {
                  sfx.click();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SECCIÓN 1: ÚNICAMENTE LOS TRES RECURSOS PRINCIPALES */}
            <div className="mt-4 space-y-2.5">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                RECURSOS DE LA BASE (3)
              </div>

              {/* 1. ENERGÍA */}
              <div className="bg-slate-950/70 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-200">Energía</span>
                    <span className="text-amber-400 font-mono font-black tabular-nums">
                      {resources.energy} %
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${resources.energy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. OXÍGENO */}
              <div className="bg-slate-950/70 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-200">Oxígeno</span>
                    <span className="text-cyan-400 font-mono font-black tabular-nums">
                      {resources.oxygen} %
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${resources.oxygen}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. AGUA */}
              <div className="bg-slate-950/70 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-200">Agua</span>
                    <span className="text-blue-400 font-mono font-black tabular-nums">
                      {resources.water} %
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${resources.water}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: LISTA VISUAL DE MÓDULOS DE LA BASE */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                ESTADO DE MÓDULOS
              </div>

              <div className="space-y-1.5">
                {/* Invernadero: ERROR (Rojo) u OPERATIVO (Verde) */}
                <div
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isError
                      ? 'bg-rose-950/60 border-rose-500/80 shadow-md shadow-rose-950/40'
                      : 'bg-slate-950/60 border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isError ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <Sprout className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-white">Invernadero</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-black px-2 py-0.5 rounded ${
                        isError
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600/30 text-emerald-300'
                      }`}
                    >
                      {isError ? 'ERROR' : 'OK'}
                    </span>

                    <button
                      onClick={() => {
                        sfx.click();
                        onNavigateToGreenhouse();
                      }}
                      className={`rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                        isError
                          ? 'bg-rose-600 hover:bg-rose-500 text-white px-2 py-1'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1'
                      }`}
                    >
                      <span>IR</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Oxígeno */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Wind className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Oxígeno</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                    OK
                  </span>
                </div>

                {/* Energía */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Energía</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                    OK
                  </span>
                </div>

                {/* Agua */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Agua</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                    OK
                  </span>
                </div>

                {/* Hábitat */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-300">Hábitat</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                    OK
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

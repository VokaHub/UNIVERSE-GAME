import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Wind, Droplets, Sprout, Home, Wifi, BatteryCharging, Radio } from 'lucide-react';
import { ResourceState } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface ControlPanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceState;
  greenhouseStatus: 'ERROR' | 'OPERATIVO';
}

export const ControlPanelDrawer: React.FC<ControlPanelDrawerProps> = ({
  isOpen,
  onClose,
  resources,
  greenhouseStatus,
}) => {
  const isError = greenhouseStatus === 'ERROR';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 sm:justify-end sm:pr-10 select-none">
          {/* Fondo atenuado que desenfoca suavemente el mapa lunar detrás */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-md cursor-pointer"
          />

          {/* TABLETA DE CONTROL DE MISIÓN (Dispositivo físico espacial) */}
          <motion.div
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.88, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="relative z-10 w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-slate-900 border-4 border-slate-700/90 rounded-3xl p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-2 ring-cyan-500/40 text-white"
          >
            {/* Detalles de la carcasa física de la tableta (Sensor superior y biseles) */}
            <div className="flex items-center justify-between px-3 py-1 mb-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold tracking-widest text-slate-300">TABLETA DE MISIÓN // ECLSS-TAB</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>100%</span>
              </div>
            </div>

            {/* Pantalla interior táctil de la tableta */}
            <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
              {/* Cabecera de la pantalla táctil */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase">
                      SUPERVISIÓN GENERAL
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight font-mono text-white mt-0.5">
                    CONTROL DE MISIÓN
                  </h3>
                </div>

                {/* Botón claro para cerrar la tableta y volver al mapa */}
                <button
                  onClick={() => {
                    sfx.click();
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow"
                  aria-label="Cerrar tableta"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>VOLVER AL MAPA</span>
                </button>
              </div>

              {/* SECCIÓN 1: RECURSOS DE LA BASE (3 recursos principales) */}
              <div className="mt-4 space-y-3">
                <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>RECURSOS VITALES</span>
                  <span className="text-[10px] text-slate-400">3 DE 3 ACTIVOS</span>
                </div>

                {/* Energía */}
                <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
                      <span className="text-slate-100">Energía</span>
                      <span className="text-amber-400 font-mono font-black tabular-nums">
                        {resources.energy} %
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${resources.energy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Oxígeno */}
                <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
                      <span className="text-slate-100">Oxígeno</span>
                      <span className="text-cyan-400 font-mono font-black tabular-nums">
                        {resources.oxygen} %
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${resources.oxygen}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Agua */}
                <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
                      <span className="text-slate-100">Agua</span>
                      <span className="text-blue-400 font-mono font-black tabular-nums">
                        {resources.water} %
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-blue-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${resources.water}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: ESTADO DE LOS SISTEMAS (Solo supervisión, sin botones de teletransporte) */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2.5">
                  ESTADO DE LOS MÓDULOS
                </div>

                <div className="space-y-2">
                  {/* Invernadero */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isError
                        ? 'bg-rose-950/70 border-rose-500 shadow-md shadow-rose-950/50'
                        : 'bg-slate-900/60 border-emerald-500/40'
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
                      <span className="text-xs sm:text-sm font-bold text-white">Invernadero Biológico</span>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-black px-2.5 py-1 rounded-lg ${
                        isError
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isError ? 'ALERTA / ERROR' : 'OPERATIVO'}
                    </span>
                  </div>

                  {/* Hábitat */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Home className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-300">Módulo Hábitat</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                      OPERATIVO
                    </span>
                  </div>

                  {/* Energía Solar */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-300">Planta Solar</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                      OPERATIVO
                    </span>
                  </div>

                  {/* Circuito de Oxígeno */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Wind className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium text-slate-300">Soporte Vital (ECLSS)</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300">
                      OPERATIVO
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranura/borde inferior de la carcasa de la tableta */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

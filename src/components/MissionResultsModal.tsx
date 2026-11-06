import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, Zap, Wind, Droplets, RotateCcw, MapPin, Eye, Sparkles } from 'lucide-react';
import { ResourceState } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface MissionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  resources: ResourceState;
  isResolved: boolean;
  totalDays: number;
}

export const MissionResultsModal: React.FC<MissionResultsModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  resources,
  isResolved,
  totalDays,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        {/* Telón oscuro desenfocado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            sfx.click();
            onClose();
          }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal de Resultados de Misión estilo Pantalla de Logro Espacial */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border-4 border-cyan-500/80 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(6,182,212,0.4)] text-white ring-2 ring-cyan-400/30"
        >
          {/* Cabecera / Emblema de Misión */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-white/10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/40 mb-3 border border-white/40">
              <Award className="w-9 h-9 sm:w-11 sm:h-11 text-slate-950" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>MISIÓN LUNAR CONCLUIDA</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-1">
              INFORME DE MISIÓN // OUTPOST
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mt-1">
              Has completado los <span className="text-cyan-300 font-bold">{totalDays} días lunares</span> de operaciones en el Cráter Shackleton.
            </p>
          </div>

          {/* Estado de Supervivencia y Balance */}
          <div className="py-4 space-y-3">
            {/* Tarjeta de Éxito / Aprendizaje Pedagógico */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-300 uppercase font-mono">
                  {isResolved ? '¡Sistemas y cultivos protegidos!' : 'Misión finalizada'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {isResolved
                    ? 'Comprendiste que cada decisión tiene un costo: enfriar el invernadero consumió un poco de energía y agua, pero mantuvo viva a la tripulación y los cultivos.'
                    : 'La base completó su periodo de misión. Recuerda revisar siempre las alertas térmicas en el invernadero.'}
                </p>
              </div>
            </div>

            {/* Resumen de Recursos Finales */}
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>RECURSOS VITALES FINALES</span>
                <span className="text-cyan-400">ESTADO ESTABLE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Energía */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400 font-mono">ENERGÍA</div>
                  <div className="text-lg sm:text-xl font-black font-mono text-amber-400">
                    {resources.energy}%
                  </div>
                </div>

                {/* Oxígeno */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400 font-mono">OXÍGENO</div>
                  <div className="text-lg sm:text-xl font-black font-mono text-cyan-400">
                    {resources.oxygen}%
                  </div>
                </div>

                {/* Agua */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-center">
                  <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400 font-mono">AGUA</div>
                  <div className="text-lg sm:text-xl font-black font-mono text-blue-400">
                    {resources.water}%
                  </div>
                </div>
              </div>
            </div>

            {/* Rango y Reconocimiento */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300 font-medium">Calificación de Comandante:</span>
              </div>
              <span className="text-xs sm:text-sm font-mono font-black text-cyan-300">
                ⭐ ⭐ ⭐ EXCELENTE
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                sfx.click();
                onClose();
              }}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>EXPLORAR LA BASE</span>
            </button>

            <button
              onClick={() => {
                sfx.click();
                onRestart();
              }}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all active:scale-95 cursor-pointer border border-white/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINICIAR MISIÓN</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

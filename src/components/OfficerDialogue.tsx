import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronRight, X, Sliders, ArrowRight } from 'lucide-react';
import { ASSET_IMAGES, MISSION_METADATA } from '../data/missionConfig';
import { sfx } from '../utils/audio';

export interface DialogueAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}

interface OfficerDialogueProps {
  isOpen: boolean;
  message: string;
  title?: string;
  actions?: DialogueAction[];
  onClose?: () => void;
  badgeText?: string;
}

export const OfficerDialogue: React.FC<OfficerDialogueProps> = ({
  isOpen,
  message,
  title = `${MISSION_METADATA.officerName} · ${MISSION_METADATA.officerRole}`,
  actions = [],
  onClose,
  badgeText = 'COMUNICACIÓN ENTRANTE',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-40"
        >
          <div className="relative bg-slate-900/95 border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-slate-100 ring-1 ring-white/10">
            {/* Cabecera del mensaje de radio */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                </span>
                <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  {badgeText}
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  CANAL PRIORITARIO 1
                </span>
              </div>

              {onClose && (
                <button
                  onClick={() => {
                    sfx.click();
                    onClose();
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  aria-label="Minimizar diálogo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Contenido: Retrato del Oficial y Burbuja de Diálogo */}
            <div className="flex items-start gap-4">
              {/* Retrato */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-cyan-500/40 bg-slate-800/80 shadow-md">
                  <img
                    src={ASSET_IMAGES.officer}
                    alt={MISSION_METADATA.officerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Fallback visual elegante si la imagen fallara
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                        target.parentElement.innerHTML = '<span class="text-xs font-mono font-bold text-cyan-300">OPS-02</span>';
                      }
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-mono font-bold px-1 rounded shadow">
                  ACTIVA
                </div>
              </div>

              {/* Texto del diálogo */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-200 tracking-wide mb-1 font-mono">
                  {title}
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-sans select-text">
                  {message}
                </p>
              </div>
            </div>

            {/* Botones de acción opcionales */}
            {actions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
                {actions.map((action, idx) => {
                  let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700';
                  if (action.danger) {
                    btnStyle = 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-lg shadow-rose-950/50';
                  } else if (action.primary) {
                    btnStyle = 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-950/50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sfx.click();
                        action.onClick();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-all active:scale-95 ${btnStyle}`}
                    >
                      {action.icon || <ChevronRight className="w-3.5 h-3.5" />}
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

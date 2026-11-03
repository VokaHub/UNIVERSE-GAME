import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';
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
  actions = [],
  onClose,
  badgeText = 'SEGUNDO AL MANDO',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-40 pointer-events-auto"
        >
          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-slate-100 ring-1 ring-white/10">
            {/* Cabecera compacta */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  {badgeText}
                </span>
              </div>

              {onClose && (
                <button
                  onClick={() => {
                    sfx.click();
                    onClose();
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                  aria-label="Cerrar diálogo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Avatar y Mensaje directo */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-cyan-400/50 bg-slate-800 shadow-md">
                  <img
                    src={ASSET_IMAGES.officer}
                    alt={MISSION_METADATA.officerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-snug">
                  {message}
                </p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            {actions.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2 justify-end">
                {actions.map((action, idx) => {
                  let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10';
                  if (action.danger) {
                    btnStyle = 'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md shadow-rose-950/40';
                  } else if (action.primary) {
                    btnStyle = 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-950/40';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        sfx.click();
                        action.onClick();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all active:scale-95 ${btnStyle}`}
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

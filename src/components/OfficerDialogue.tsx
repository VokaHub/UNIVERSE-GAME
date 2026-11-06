import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Radio, Play } from 'lucide-react';
import { ASSET_IMAGES } from '../data/missionConfig';
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
  badgeText = 'ASISTENTE DEL COMANDANTE',
}) => {
  const isEmergency = badgeText === 'EMERGENCIA' || badgeText === 'ERROR';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none select-none flex flex-col justify-end pb-2 sm:pb-4">
          <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 flex flex-col sm:flex-row items-end justify-start gap-2 sm:gap-6">
            
            {/* 1. PERSONAJE NPC DE CUERPO PRESENTE (Silueta Transparente auténtica emergiendo desde la izquierda) */}
            <motion.div
              initial={{ y: 160, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 160, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0 pointer-events-none z-10 w-[180px] sm:w-[290px] md:w-[350px] lg:w-[400px] h-[34vh] sm:h-[54vh] md:h-[62vh] max-h-[620px]"
            >
              <img
                src={ASSET_IMAGES.officer}
                alt="ASISTENTE DEL COMANDANTE"
                referrerPolicy="no-referrer"
                className="absolute bottom-0 pointer-events-none select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] max-w-none"
                style={{
                  height: '135%',
                  width: 'auto',
                  left: '50%',
                  transform: 'translateX(-52.2%) translateY(11.5%)',
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </motion.div>

            {/* 2. CAJA DE DIÁLOGO ESTILO VIDEOJUEGO (Inspirada en RPG / Aventura Espacial) */}
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto z-20 mb-2 sm:mb-6 w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
            >
              {/* Placa superior estilo cartela de juego con el título del personaje */}
              <div className="relative inline-flex items-center gap-2 px-4 py-1.5 mb-1.5 rounded-t-xl bg-slate-950/95 border-t-2 border-x-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-cyan-950 border border-cyan-400/80 text-cyan-300">
                  <Radio className="w-3 h-3 animate-pulse" />
                </span>
                <span className="text-xs sm:text-sm font-black tracking-widest text-cyan-300 font-mono uppercase">
                  ASISTENTE DEL COMANDANTE
                </span>
                {isEmergency && (
                  <span className="ml-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-600/90 text-white animate-pulse border border-rose-400">
                    ¡ALERTA!
                  </span>
                )}
                {badgeText && badgeText !== 'ASISTENTE DEL COMANDANTE' && !isEmergency && (
                  <span className="ml-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-400/40">
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Contenedor principal de diálogo con estética Sci-Fi */}
              <div className="relative bg-slate-950/95 border-2 border-cyan-400/70 rounded-2xl rounded-tl-none p-4 sm:p-5 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-slate-100 ring-1 ring-cyan-500/30">
                
                {/* Acento luminoso en esquina superior derecha */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-60" />
                  {onClose && (
                    <button
                      onClick={() => {
                        sfx.click();
                        onClose();
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                      aria-label="Cerrar diálogo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Texto del diálogo (Prose limpio, grande y adaptado para niños de 7 a 12 años) */}
                <div className="pr-6">
                  <p className="text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed font-sans select-text">
                    «{message}»
                  </p>
                </div>

                {/* Botones de acción táctiles interactivos */}
                {actions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-end gap-2.5">
                    {actions.map((action, idx) => {
                      let btnStyle = 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-cyan-500/40';
                      if (action.danger) {
                        btnStyle = 'bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-950/50 border border-rose-400';
                      } else if (action.primary) {
                        btnStyle = 'bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/60';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            sfx.click();
                            action.onClick();
                          }}
                          className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl transition-all active:scale-95 cursor-pointer font-bold ${btnStyle}`}
                        >
                          <span>{action.label}</span>
                          {action.icon || <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            </motion.div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

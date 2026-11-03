import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sliders, AlertCircle, CheckCircle, Home } from 'lucide-react';
import { MISSION_METADATA } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface HeaderProps {
  simTime: string;
  hasIncident: boolean;
  isResolved: boolean;
  onOpenControlPanel: () => void;
  onResetToWelcome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  simTime,
  hasIncident,
  isResolved,
  onOpenControlPanel,
  onResetToWelcome,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-3 py-2 sm:px-6 sm:py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white select-none">
      {/* Título del juego & Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-wider text-cyan-400 font-mono">
            {MISSION_METADATA.name}
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline">
            POLO SUR LUNAR · 48H
          </span>
        </div>
      </div>

      {/* Reloj y Estado compacto */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400 text-[10px] hidden sm:inline">TIEMPO:</span>
          <span className="font-bold text-cyan-300 tabular-nums">{simTime}</span>
        </div>

        {/* Indicador de estado */}
        {hasIncident && !isResolved ? (
          <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold px-2.5 py-1 rounded-lg animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>ALERTA</span>
          </div>
        ) : isResolved ? (
          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>TODO OK</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-mono px-2 py-1 rounded-lg">
            <span>NORMAL</span>
          </div>
        )}
      </div>

      {/* Controles: Audio, Reiniciar (Inicio) y Panel */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onToggleMute();
            sfx.click();
          }}
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Botón para reiniciar toda la demostración y volver a bienvenida */}
        <button
          onClick={() => {
            sfx.click();
            onResetToWelcome();
          }}
          title="Reiniciar y volver a la pantalla de bienvenida"
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>

        <button
          onClick={() => {
            sfx.click();
            onOpenControlPanel();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow active:scale-95 ${
            hasIncident && !isResolved
              ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>PANEL</span>
        </button>
      </div>
    </header>
  );
};

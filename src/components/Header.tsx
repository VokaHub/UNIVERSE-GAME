import React from 'react';
import { Volume2, VolumeX, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { MISSION_METADATA } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface HeaderProps {
  currentDay: number;
  totalDays: number;
  secondsRemaining: number;
  hasIncident: boolean;
  isResolved: boolean;
  onResetToWelcome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  totalDays,
  secondsRemaining,
  hasIncident,
  isResolved,
  onResetToWelcome,
  isMuted,
  onToggleMute,
}) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="relative z-30 flex items-center justify-between px-3 py-2 sm:px-6 sm:py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white select-none">
      {/* Ubicación de Misión */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black tracking-wider text-cyan-400 font-mono uppercase">
            {MISSION_METADATA.location}
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline">
            · CRÁTER SHACKLETON
          </span>
        </div>
      </div>

      {/* Reloj Central de 7 Días (420s total, 60s por día) y Estado */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Contador de Día Lunar */}
        <div className="bg-cyan-950/70 border border-cyan-500/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-200">
            DÍA {currentDay} <span className="text-cyan-400/60">/ {totalDays}</span>
          </span>
        </div>

        {/* Cuenta Regresiva de Tiempo */}
        <div className="bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400 text-[10px] hidden sm:inline">RESTANTE:</span>
          <span className="font-bold text-cyan-300 tabular-nums">{timeFormatted}</span>
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

      {/* Controles discretos: Sonido y Reinicio (Sin botón duplicado de Panel) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onToggleMute();
            sfx.click();
          }}
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            sfx.click();
            onResetToWelcome();
          }}
          title="Reiniciar y volver a la pantalla de bienvenida"
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>
    </header>
  );
};

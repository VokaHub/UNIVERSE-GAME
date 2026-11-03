import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sliders, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MISSION_METADATA } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface HeaderProps {
  simTime: string;
  hasIncident: boolean;
  isResolved: boolean;
  onOpenControlPanel: () => void;
  onResetDemo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  simTime,
  hasIncident,
  isResolved,
  onOpenControlPanel,
  onResetDemo,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 text-slate-100 shadow-xl">
      {/* Zona 1: Identificador de Misión y Rol */}
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-extrabold tracking-wider text-cyan-400 font-mono">
            {MISSION_METADATA.name}
          </span>
          <span className="text-xs text-slate-400 hidden md:inline font-mono">
            // {MISSION_METADATA.location}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono border-l border-slate-800 pl-4">
          <span className="text-slate-200">{MISSION_METADATA.commanderRole}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>MISIÓN: {MISSION_METADATA.totalHours} HORAS</span>
        </div>
      </div>

      {/* Zona 2: Reloj de Simulación y Estado */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded px-2.5 py-1">
          <span className="text-[10px] tracking-wider text-slate-400 uppercase font-mono hidden sm:inline">
            T-SIM
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 tabular-nums">
            {simTime}
          </span>
        </div>

        {/* Indicador de Estado General */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          {hasIncident && !isResolved ? (
            <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-1 rounded">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold">ALERTA EN INVERNADERO</span>
            </div>
          ) : isResolved ? (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SISTEMAS OPERATIVOS</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded">
              <span>SISTEMAS NOMINALES</span>
            </div>
          )}
        </div>
      </div>

      {/* Zona 3: Acciones Primarias */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle de Audio */}
        <button
          onClick={() => {
            onToggleMute();
            sfx.click();
          }}
          title={isMuted ? 'Activar sonido FX' : 'Silenciar sonido FX'}
          aria-label={isMuted ? 'Activar sonido FX' : 'Silenciar sonido FX'}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Botón de Reinicio de Demostración */}
        <button
          onClick={() => {
            sfx.click();
            onResetDemo();
          }}
          title="Reiniciar la demostración del incidente"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>

        {/* Botón Principal: Panel de Control */}
        <button
          onClick={() => {
            sfx.click();
            onOpenControlPanel();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded transition-all shadow-md active:scale-95 ${
            hasIncident && !isResolved
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-2 ring-rose-500/50 animate-pulse'
              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-cyan-900/30'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="tracking-wide">PANEL DE CONTROL</span>
        </button>
      </div>
    </header>
  );
};

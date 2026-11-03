import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, ArrowRight, Eye, Info, Sparkles, Navigation } from 'lucide-react';
import { ASSET_IMAGES, OUTPOST_MODULES, MISSION_METADATA } from '../data/missionConfig';
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
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  // El invernadero tiene coordenadas específicas sobre el domo agrícola de la imagen
  const isGreenhouseError = hasIncident && !isResolved;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[calc(100vh-53px)] overflow-hidden bg-slate-950"
    >
      {/* Imagen panorámica de fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.lunarBase}
          alt="Base Lunar OUTPOST"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Scrim cinematográfico sutil para bordes y contraste HUD */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      {/* Cuadrícula de coordenadas tácticas discretas */}
      <div className="absolute top-4 left-4 z-10 hidden sm:flex flex-col gap-1 text-[11px] font-mono text-cyan-400/70 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">{MISSION_METADATA.sublocation}</span>
        </div>
        <div className="text-slate-400 text-[10px]">
          Elevación solar: 1.5° · Temp exterior: -130 °C
        </div>
      </div>

      {/* Tarjeta de Alerta de Esquina / Notificación de Misión */}
      <div className="absolute top-4 right-4 z-20 max-w-xs sm:max-w-sm">
        {isGreenhouseError ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3.5 sm:p-4 rounded-xl bg-rose-950/90 border border-rose-600/90 backdrop-blur-xl shadow-2xl shadow-rose-950/70 text-slate-100 ring-1 ring-rose-500/50"
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <div className="text-xs font-mono font-bold tracking-wider text-rose-300 uppercase">
                  INVERNADERO: ERROR
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  TEMPERATURA ELEVADA (34 °C)
                </div>
                <p className="text-xs text-rose-200/80 mt-1">
                  Fallo de refrigeración. Cultivos hidropónicos en riesgo inminente.
                </p>
                <button
                  onClick={() => {
                    sfx.transition();
                    onSelectGreenhouse();
                  }}
                  className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow active:scale-95"
                >
                  <span>IR AL INVERNADERO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : isResolved ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-emerald-950/85 border border-emerald-500/70 backdrop-blur-xl shadow-xl text-slate-100"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase">
                  INCIDENTE RESUELTO
                </div>
                <div className="text-xs text-slate-300">
                  Temperatura estabilizada a 25 °C · Base operativa
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-slate-300 text-xs font-mono">
            ESTADO BASE: TODOS LOS SISTEMAS NOMINALES
          </div>
        )}
      </div>

      {/* Marcador Interactivo: INVERNADERO (Foco Principal de la Misión) */}
      <div
        className="absolute z-20"
        style={{ left: '60%', top: '48%' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {/* Anillos de pulso táctico */}
          {isGreenhouseError && (
            <span className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping" />
          )}

          {/* Botón / Zona Seleccionable */}
          <button
            onClick={() => {
              sfx.transition();
              onSelectGreenhouse();
            }}
            onMouseEnter={() => {
              sfx.click();
              setHoveredModule('greenhouse');
            }}
            onMouseLeave={() => setHoveredModule(null)}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all cursor-pointer shadow-2xl active:scale-95 ${
              isGreenhouseError
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-rose-900/80 hover:bg-rose-900'
                : 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-emerald-950/60 hover:bg-emerald-900'
            }`}
            aria-label="Seleccionar Módulo Invernadero"
          >
            {isGreenhouseError ? (
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}

            {/* Etiqueta flotante siempre visible o al hover */}
            <div
              className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded font-mono font-bold text-xs whitespace-nowrap shadow-lg border pointer-events-none transition-all ${
                isGreenhouseError
                  ? 'bg-rose-900/95 border-rose-500 text-white'
                  : 'bg-slate-900/95 border-emerald-500 text-emerald-300'
              }`}
            >
              INVERNADERO
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                  isGreenhouseError ? 'border-t-rose-900' : 'border-t-slate-900'
                }`}
              />
            </div>
          </button>

          {/* Detalle emergente expandido en hover */}
          {hoveredModule === 'greenhouse' && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-56 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl z-30 text-xs font-mono text-slate-200 pointer-events-none">
              <div className="font-bold text-cyan-300 pb-1 border-b border-slate-800 flex justify-between">
                <span>AGRO-01</span>
                <span>{isGreenhouseError ? '34 °C' : '25 °C'}</span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-300 font-sans">
                {isGreenhouseError
                  ? 'Sobrecarga térmica detectada. Clic para ingresar al módulo.'
                  : 'Cultivos protegidos con refrigeración de emergencia.'}
              </p>
              <div className="mt-2 text-[10px] text-cyan-400 font-bold">
                CLIC PARA ENTRAR ➜
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Marcador secundario: Módulo Habitacional (HAB-01) */}
      <div
        className="absolute z-10 hidden sm:block"
        style={{ left: '42%', top: '62%' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 group">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>MÓDULO HÁBITAT</span>
          </div>
        </div>
      </div>

      {/* Marcador secundario: Planta Solar */}
      <div
        className="absolute z-10 hidden md:block"
        style={{ left: '26%', top: '44%' }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 group">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950/80 border border-slate-700/80 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PLANTA SOLAR</span>
          </div>
        </div>
      </div>

      {/* Botón flotante inferior para abrir el Panel de Control si se prefiere */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => {
            sfx.click();
            onOpenControlPanel();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-cyan-500/40 backdrop-blur-md shadow-xl text-xs font-mono font-semibold transition-all active:scale-95"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>CONSULTAR SISTEMAS BASE</span>
        </button>
      </div>

      {/* Espacio para el diálogo inferior */}
      <div className="relative z-10 h-28 sm:h-24 pointer-events-none" />
    </motion.div>
  );
};

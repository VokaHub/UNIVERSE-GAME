import React from 'react';
import { motion } from 'motion/react';
import { Thermometer, ArrowLeft, Power, CheckCircle, AlertTriangle, Wind, Zap, Droplets } from 'lucide-react';
import { ASSET_IMAGES, ResourceState } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface GreenhouseSceneProps {
  isResolved: boolean;
  onActivateEmergencyCooling: () => void;
  onReturnToBase: () => void;
  isCoolingActive: boolean;
  currentTemp: number;
  resources: ResourceState;
}

export const GreenhouseScene: React.FC<GreenhouseSceneProps> = ({
  isResolved,
  onActivateEmergencyCooling,
  onReturnToBase,
  isCoolingActive,
  currentTemp,
  resources,
}) => {
  const handleActivate = () => {
    if (isResolved || isCoolingActive) return;
    sfx.emergencyCooling();
    onActivateEmergencyCooling();
  };

  return (
    <motion.div
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[calc(100vh-49px)] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. Escenario Interior 3D - Máximo Protagonismo */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.greenhouse}
          alt="Interior del Invernadero Lunar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* Tinte térmico sutil mínimo */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none ${
            isResolved ? 'bg-slate-950/20' : 'bg-rose-950/25'
          }`}
        />
      </div>

      {/* 2. Barra Superior Mínima */}
      <div className="relative z-10 p-3 sm:p-5 flex items-center justify-between">
        <button
          onClick={() => {
            sfx.transition();
            onReturnToBase();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-white/10 backdrop-blur-md transition-all active:scale-95 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>VOLVER A LA BASE</span>
        </button>

        {/* Estado simplificado */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-black shadow-lg backdrop-blur-md border ${
            isResolved
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/60 animate-pulse'
          }`}
        >
          {isResolved ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>INVERNADERO: OPERATIVO</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>INVERNADERO: ERROR</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Panel Flotante de Control (Temperatura + Estado + Botón + Impacto en Recursos) */}
      <div className="relative z-20 max-w-md mx-auto w-full px-4 mb-20 sm:mb-8">
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white">
          {/* Fila 1: Lectura de Temperatura Grande */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isResolved
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400 animate-pulse'
                }`}
              >
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  TEMPERATURA
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black tabular-nums">
                  <span
                    className={
                      isResolved
                        ? 'text-emerald-400'
                        : currentTemp > 30
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }
                  >
                    {currentTemp}
                  </span>
                  <span className="text-base text-slate-400 ml-1">°C</span>
                </div>
              </div>
            </div>

            {/* Estado del sistema */}
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                REFRIGERACIÓN
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded inline-block mt-1 ${
                  isResolved || isCoolingActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isResolved || isCoolingActive ? 'EMERGENCIA ACTIVA' : 'FALLO PRINCIPAL'}
              </span>
            </div>
          </div>

          {/* Mini-monitor visual de los 3 recursos en tiempo real */}
          <div className="my-3 py-2 px-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Energía:</span>
              <span className="font-bold text-amber-400">{resources.energy}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Oxígeno:</span>
              <span className="font-bold text-cyan-400">{resources.oxygen}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Agua:</span>
              <span className="font-bold text-blue-400">{resources.water}%</span>
            </div>
          </div>

          {/* Fila 2: Botón de Acción Principal */}
          <div>
            {!isResolved && !isCoolingActive ? (
              <button
                onClick={handleActivate}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-xl shadow-cyan-950/60 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-0.5 border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <Power className="w-4 h-4 text-slate-950" />
                  <span>ACTIVAR REFRIGERACIÓN DE EMERGENCIA</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-800">
                  Consumo: -5% Energía · -3% Agua
                </span>
              </button>
            ) : isCoolingActive ? (
              <div className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-500/60 flex items-center justify-center gap-2 animate-pulse">
                <Wind className="w-4 h-4 animate-spin" />
                <span>DISIPANDO CALOR... ({currentTemp} °C)</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-full py-2 px-3 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>TEMPERATURA ESTABILIZADA A 25 °C</span>
                </div>

                <button
                  onClick={() => {
                    sfx.transition();
                    onReturnToBase();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>REGRESAR A LA BASE LUNAR</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

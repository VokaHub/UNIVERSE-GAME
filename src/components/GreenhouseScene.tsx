import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Thermometer, ShieldAlert, CheckCircle2, ArrowLeft, Power, Sparkles, AlertTriangle, Wind } from 'lucide-react';
import { ASSET_IMAGES, INCIDENT_CONFIG } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface GreenhouseSceneProps {
  isResolved: boolean;
  onActivateEmergencyCooling: () => void;
  onReturnToBase: () => void;
  isCoolingActive: boolean;
  currentTemp: number;
}

export const GreenhouseScene: React.FC<GreenhouseSceneProps> = ({
  isResolved,
  onActivateEmergencyCooling,
  onReturnToBase,
  isCoolingActive,
  currentTemp,
}) => {
  // Estado local para animación de activación
  const [activating, setActivating] = useState(false);

  const handleActivate = () => {
    if (isResolved || isCoolingActive || activating) return;
    setActivating(true);
    sfx.emergencyCooling();
    onActivateEmergencyCooling();
  };

  // Rango térmico: porcentaje de posición en barra [15°C a 40°C]
  const tempPercentage = Math.min(Math.max(((currentTemp - 15) / (40 - 15)) * 100, 0), 100);

  return (
    <motion.div
      initial={{ scale: 1.15, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[calc(100vh-53px)] overflow-hidden flex flex-col justify-between"
    >
      {/* Fondo Invernadero */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.greenhouse}
          alt="Interior del Invernadero Lunar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
        />
        {/* Scrim y tinte térmico sutil para contrastar HUD */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isResolved
              ? 'bg-slate-950/40 mix-blend-multiply'
              : 'bg-rose-950/30 mix-blend-color-burn'
          }`}
        />
        {/* Gradiente viñeta para legibilidad de HUD */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />
      </div>

      {/* Top Bar del Módulo */}
      <div className="relative z-10 px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sfx.transition();
              onReturnToBase();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>REGRESAR A LA BASE</span>
          </button>

          <div className="hidden sm:block text-xs font-mono text-slate-400 border-l border-slate-700/80 pl-3">
            SECTOR CULTIVOS HIDROPÓNICOS // POLO SUR LUNAR
          </div>
        </div>

        {/* Estado del Invernadero */}
        <div className="flex items-center gap-2">
          {isResolved ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shadow-lg shadow-emerald-950/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ESTADO: OPERATIVO</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold animate-pulse shadow-lg shadow-rose-950/50">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>ESTADO: TEMPERATURA ELEVADA</span>
            </div>
          )}
        </div>
      </div>

      {/* Centro: Panel de Telemetría Térmica e Instrumentación */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          
          {/* Tarjeta de Telemetría Térmica (5 columnas) */}
          <div className="md:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">
                  TELEMETRÍA TÉRMICA
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  SENSOR T-04B
                </span>
              </div>

              {/* Indicador Numérico Grande */}
              <div className="my-5 flex items-baseline gap-3">
                <Thermometer
                  className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                    isResolved
                      ? 'text-emerald-400'
                      : currentTemp > 30
                      ? 'text-rose-500 animate-pulse'
                      : 'text-amber-400'
                  }`}
                />
                <div className="flex items-baseline">
                  <span
                    className={`text-4xl sm:text-5xl font-mono font-extrabold tabular-nums tracking-tight transition-colors ${
                      isResolved
                        ? 'text-emerald-400'
                        : currentTemp > 30
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {currentTemp}
                  </span>
                  <span className="text-2xl font-mono text-slate-400 ml-1">°C</span>
                </div>

                <div className="ml-auto text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-500">
                    Rango Seguro
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-300">
                    20 °C – 26 °C
                  </div>
                </div>
              </div>

              {/* Barra de Temperatura Visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>15 °C</span>
                  <span className="text-emerald-400">ÓPTIMO [20-26]</span>
                  <span className="text-rose-400">40 °C</span>
                </div>

                <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  {/* Zona segura delimitada */}
                  <div className="absolute left-[20%] right-[56%] top-0 bottom-0 bg-emerald-500/20 border-x border-emerald-500/40" />

                  {/* Barra de progreso */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isResolved
                        ? 'bg-emerald-500'
                        : currentTemp > 30
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${tempPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Diagnóstico de Climatización */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Compresor Primario:</span>
                <span className="text-rose-400 font-semibold">FALLO (Inoperativo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refrigeración Auxiliar:</span>
                <span
                  className={
                    isResolved || isCoolingActive
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-400 font-semibold'
                  }
                >
                  {isResolved || isCoolingActive ? 'EN LÍNEA (100%)' : 'EN ESPERA (Standby)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Riesgo Cultivos:</span>
                <span
                  className={
                    isResolved ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'
                  }
                >
                  {isResolved ? 'NULO · PROTEGIDOS' : 'ALTO · ESTRÉS TÉRMICO'}
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Control Interactivo (7 columnas) */}
          <div className="md:col-span-7 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Wind className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  SISTEMA DE REFRIGERACIÓN DE EMERGENCIA
                </h3>
              </div>

              {/* Descripción del problema */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                <p>
                  El sistema principal de climatización ha fallado por sobrecarga térmica y la temperatura interior ha alcanzado los <strong className="text-rose-400">34 °C</strong>.
                </p>
                <p className="text-slate-400 text-xs">
                  Para evitar daños irreversibles en los cultivos, active el sistema auxiliar criogénico de emergencia. 
                  <span className="text-amber-400 block mt-1 font-mono text-[11px]">
                    ▲ ADVERTENCIA: Esta acción consumirá +5% de energía adicional de la base lunar (la reserva descenderá de 78% a 73%).
                  </span>
                </p>
              </div>

              {/* Estado actual del actuador */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 font-mono text-xs">
                <span className="text-slate-400">Estado del Sistema Auxiliar:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    isResolved || isCoolingActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isResolved || isCoolingActive ? 'ACTIVADO' : 'DESACTIVADO'}
                </span>
              </div>
            </div>

            {/* Acción Principal */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              {!isResolved && !isCoolingActive ? (
                <button
                  onClick={handleActivate}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-950/60 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-cyan-400/30"
                >
                  <Power className="w-5 h-5" />
                  <span>ACTIVAR REFRIGERACIÓN DE EMERGENCIA</span>
                </button>
              ) : isCoolingActive ? (
                <div className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-cyan-300 bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center gap-3 animate-pulse">
                  <Wind className="w-5 h-5 animate-spin" />
                  <span>DISIPANDO CALOR HACIA RADIADORES EXTERNOS... ({currentTemp} °C)</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center gap-2 shadow-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>TEMPERATURA ESTABILIZADA EN 25 °C · INCIDENTE CONTROLADO</span>
                  </div>

                  <button
                    onClick={() => {
                      sfx.transition();
                      onReturnToBase();
                    }}
                    className="w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-xl shadow-cyan-950/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>REGRESAR A LA BASE LUNAR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Espaciador inferior para que el diálogo del oficial no tape controles */}
      <div className="relative z-10 h-28 sm:h-24 pointer-events-none" />
    </motion.div>
  );
};

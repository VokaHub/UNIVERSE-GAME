import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Wind, Droplets, Apple, AlertTriangle, CheckCircle, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { ResourceState, MISSION_METADATA } from '../data/missionConfig';
import { sfx } from '../utils/audio';

interface ControlPanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceState;
  greenhouseStatus: 'ERROR' | 'OPERATIVO';
  onNavigateToGreenhouse: () => void;
}

export const ControlPanelDrawer: React.FC<ControlPanelDrawerProps> = ({
  isOpen,
  onClose,
  resources,
  greenhouseStatus,
  onNavigateToGreenhouse,
}) => {
  const isError = greenhouseStatus === 'ERROR';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Panel Desplegable desde la parte inferior */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-cyan-500/30 rounded-t-2xl shadow-2xl backdrop-blur-xl text-slate-100 max-h-[85vh] overflow-y-auto"
          >
            {/* Tirador superior / Bar */}
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto my-3" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
              {/* Encabezado del Panel */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                      SISTEMA DE GESTIÓN CENTRAL
                    </span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      BASE POLO SUR LUNAR
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-0.5">
                    PANEL DE CONTROL GENERAL
                  </h3>
                </div>

                <button
                  onClick={() => {
                    sfx.click();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>VOLVER</span>
                </button>
              </div>

              {/* Grid de Recursos Principales */}
              <div className="mt-6">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  RECURSOS VITALES DE LA BASE
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Energía */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Energía
                      </span>
                      <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                        {resources.energy}%
                      </span>
                    </div>
                    {/* Barra de recurso */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-700 rounded-full"
                        style={{ width: `${resources.energy}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-mono">
                      {resources.energy < 78
                        ? 'Sobrecarga auxiliar activa (-5%)'
                        : 'Red fotovoltaica estable'}
                    </div>
                  </div>

                  {/* Oxígeno */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        Oxígeno
                      </span>
                      <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
                        {resources.oxygen}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-700 rounded-full"
                        style={{ width: `${resources.oxygen}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-mono">
                      Soporte vital nominal (ECLSS)
                    </div>
                  </div>

                  {/* Agua */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        Agua
                      </span>
                      <span className="text-lg font-mono font-bold text-blue-400 tabular-nums">
                        {resources.water}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 h-full transition-all duration-700 rounded-full"
                        style={{ width: `${resources.water}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-mono">
                      Reciclaje en circuito cerrado 98%
                    </div>
                  </div>

                  {/* Alimentos */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Apple className="w-4 h-4 text-emerald-400" />
                        Alimentos
                      </span>
                      <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                        {resources.food}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-700 rounded-full"
                        style={{ width: `${resources.food}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 font-mono">
                      Raciones liofilizadas + cultivo fresco
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de Módulos - Foco en Invernadero */}
              <div className="mt-6">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  ESTADO DE MÓDULOS OPERATIVOS
                </h4>

                <div className="space-y-3">
                  {/* Tarjeta interactiva del Invernadero */}
                  <div
                    className={`relative rounded-xl p-4 border transition-all ${
                      isError
                        ? 'bg-rose-950/40 border-rose-600/80 ring-1 ring-rose-500/40 hover:bg-rose-950/60'
                        : 'bg-emerald-950/30 border-emerald-600/60 hover:bg-emerald-950/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`p-2.5 rounded-lg shrink-0 ${
                            isError
                              ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isError ? (
                            <AlertTriangle className="w-6 h-6" />
                          ) : (
                            <CheckCircle className="w-6 h-6" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-white">
                              INVERNADERO BIOLÓGICO (AGRO-01)
                            </span>
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                isError
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isError ? 'ERROR: TEMPERATURA ELEVADA' : 'OPERATIVO'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {isError
                              ? 'Fallo en sistema principal de refrigeración (34 °C). Riesgo térmico en cultivos de biomasa.'
                              : 'Temperatura estabilizada a 25 °C mediante sistema auxiliar de emergencia. Cultivos fuera de peligro.'}
                          </p>
                        </div>
                      </div>

                      {/* Botón de acceso al escenario */}
                      <button
                        onClick={() => {
                          sfx.click();
                          onNavigateToGreenhouse();
                        }}
                        className={`flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all shrink-0 active:scale-95 ${
                          isError
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md'
                        }`}
                      >
                        <span>{isError ? 'IR AL INVERNADERO' : 'INSPECCIONAR INVERNADERO'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Barra de estado del módulo */}
                    <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isError ? 'bg-rose-500 w-full animate-pulse' : 'bg-emerald-500 w-full'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Otros módulos en estado nominal */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Módulo Hábitat (HAB-01)
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">Presión: 101.3 kPa</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                        OPERATIVO
                      </span>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Planta Solar (PWR-ARRAY)
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">Baterías: OK</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                        OPERATIVO
                      </span>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Comunicaciones DSN
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">Enlace Tierra: 1.28s</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                        OPERATIVO
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota de pie explicativa */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-start gap-2 text-slate-500 text-xs">
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <p>
                  <span className="font-semibold text-slate-400">Nota técnica:</span> {MISSION_METADATA.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

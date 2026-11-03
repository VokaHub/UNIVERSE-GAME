/**
 * @file App.tsx
 * @description Maqueta interactiva del videojuego de simulación espacial OUTPOST.
 * Control de estados, narrativa, panel de control y escenarios (Base Lunar / Invernadero).
 */

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BaseMap } from './components/BaseMap';
import { GreenhouseScene } from './components/GreenhouseScene';
import { ControlPanelDrawer } from './components/ControlPanelDrawer';
import { OfficerDialogue, DialogueAction } from './components/OfficerDialogue';
import {
  MISSION_METADATA,
  INITIAL_RESOURCES,
  RESOLVED_RESOURCES,
  INCIDENT_CONFIG,
  ResourceState,
} from './data/missionConfig';
import { sfx } from './utils/audio';

type ActiveScene = 'BASE' | 'GREENHOUSE';

export default function App() {
  // Estado de escena activa
  const [currentScene, setCurrentScene] = useState<ActiveScene>('BASE');

  // Estado del incidente y resolución
  const [hasIncident, setHasIncident] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [isCoolingActive, setIsCoolingActive] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(INCIDENT_CONFIG.initialTemp);

  // Recursos de la base (Valores ficticios para maqueta)
  const [resources, setResources] = useState<ResourceState>(INITIAL_RESOURCES);

  // Tiempo simulado
  const [simTime, setSimTime] = useState<string>(MISSION_METADATA.initialSimTime);

  // Panel de control desplegable
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(false);

  // Diálogo del Oficial
  const [isOfficerOpen, setIsOfficerOpen] = useState<boolean>(false);
  const [officerMessage, setOfficerMessage] = useState<string>('');
  const [officerBadge, setOfficerBadge] = useState<string>('COMUNICACIÓN ENTRANTE');
  const [dialogueActions, setDialogueActions] = useState<DialogueAction[]>([]);

  // Silenciar sonido
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Referencia para temporizadores
  const coolingIntervalRef = useRef<number | null>(null);

  /**
   * Ciclo inicial: Desatar el incidente tras unos segundos como solicita el briefing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerIncident();
    }, INCIDENT_CONFIG.delayBeforeIncidentTriggerMs);

    return () => clearTimeout(timer);
  }, []);

  /**
   * Dispara el incidente inicial
   */
  const triggerIncident = () => {
    setHasIncident(true);
    setSimTime('00:15 / 48:00');
    sfx.alert();

    setOfficerBadge('EMERGENCIA');
    setOfficerMessage(INCIDENT_CONFIG.dialogues.alert);
    setDialogueActions([
      {
        label: 'PANEL DE CONTROL',
        onClick: () => {
          setIsOfficerOpen(false);
          setIsControlPanelOpen(true);
        },
      },
      {
        label: 'IR AL INVERNADERO',
        primary: true,
        onClick: () => {
          navigateToGreenhouse();
        },
      },
    ]);
    setIsOfficerOpen(true);
  };

  /**
   * Navega hacia el escenario del Invernadero
   */
  const navigateToGreenhouse = () => {
    setIsControlPanelOpen(false);
    setCurrentScene('GREENHOUSE');
    sfx.transition();

    // Diálogo del oficial al llegar al invernadero
    if (!isResolved) {
      setTimeout(() => {
        setOfficerBadge('INVERNADERO');
        setOfficerMessage(INCIDENT_CONFIG.dialogues.greenhouseBriefing);
        setDialogueActions([
          {
            label: 'ACTIVAR REFRIGERACIÓN',
            primary: true,
            onClick: () => {
              handleActivateEmergencyCooling();
            },
          },
        ]);
        setIsOfficerOpen(true);
      }, 400);
    } else {
      setIsOfficerOpen(false);
    }
  };

  /**
   * Regresa al mapa panorámico de la base
   */
  const navigateToBase = () => {
    setCurrentScene('BASE');
    sfx.transition();

    if (isResolved) {
      setTimeout(() => {
        setOfficerBadge('MISIÓN');
        setOfficerMessage(INCIDENT_CONFIG.dialogues.incidentResolvedBase);
        setDialogueActions([
          {
            label: 'VER PANEL',
            onClick: () => {
              setIsOfficerOpen(false);
              setIsControlPanelOpen(true);
            },
          },
          {
            label: 'CONTINUAR',
            onClick: () => setIsOfficerOpen(false),
          },
        ]);
        setIsOfficerOpen(true);
      }, 350);
    }
  };

  /**
   * Acción: Activar refrigeración de emergencia
   * - Desciende la temperatura de 34 °C a 25 °C
   * - Cambia el estado del invernadero a OPERATIVO
   * - Reduce la energía de la base de 78% a 73%
   * - Oficial comunica resolución
   */
  const handleActivateEmergencyCooling = () => {
    if (isResolved || isCoolingActive) return;

    setIsCoolingActive(true);
    setIsOfficerOpen(false);

    // Animación de descenso progresivo de temperatura (34 -> 25)
    let temp = INCIDENT_CONFIG.initialTemp;
    const target = INCIDENT_CONFIG.targetTemp;
    const stepDuration = INCIDENT_CONFIG.emergencyCoolingDurationMs / (temp - target);

    if (coolingIntervalRef.current) {
      window.clearInterval(coolingIntervalRef.current);
    }

    coolingIntervalRef.current = window.setInterval(() => {
      temp -= 1;
      setCurrentTemp(temp);

      if (temp <= target) {
        if (coolingIntervalRef.current) {
          window.clearInterval(coolingIntervalRef.current);
          coolingIntervalRef.current = null;
        }

        // Consecuencias completadas
        setIsCoolingActive(false);
        setIsResolved(true);
        setResources(RESOLVED_RESOURCES);
        setSimTime('01:20 / 48:00');
        sfx.success();

        // Diálogo de confirmación del oficial (máximo 2 frases)
        setTimeout(() => {
          setOfficerBadge('ESTABILIZADO');
          setOfficerMessage(INCIDENT_CONFIG.dialogues.stabilized);
          setDialogueActions([
            {
              label: 'REGRESAR A LA BASE',
              primary: true,
              onClick: () => {
                setIsOfficerOpen(false);
                navigateToBase();
              },
            },
          ]);
          setIsOfficerOpen(true);
        }, 400);
      }
    }, stepDuration);
  };

  /**
   * Reiniciar la demostración para permitir repetir la experiencia
   */
  const handleResetDemo = () => {
    if (coolingIntervalRef.current) {
      window.clearInterval(coolingIntervalRef.current);
      coolingIntervalRef.current = null;
    }

    setCurrentScene('BASE');
    setHasIncident(false);
    setIsResolved(false);
    setIsCoolingActive(false);
    setCurrentTemp(INCIDENT_CONFIG.initialTemp);
    setResources(INITIAL_RESOURCES);
    setSimTime(MISSION_METADATA.initialSimTime);
    setIsControlPanelOpen(false);
    setIsOfficerOpen(false);

    // Volver a detonar tras unos segundos
    setTimeout(() => {
      triggerIncident();
    }, 1200);
  };

  /**
   * Conmutar sonido FX
   */
  const handleToggleMute = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* 1. Encabezado de Navegación y Telemetría */}
      <Header
        simTime={simTime}
        hasIncident={hasIncident}
        isResolved={isResolved}
        onOpenControlPanel={() => setIsControlPanelOpen(true)}
        onResetDemo={handleResetDemo}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Escenario Activo: Base Lunar o Interior de Invernadero */}
      <main className="relative flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScene === 'BASE' ? (
            <BaseMap
              key="base"
              hasIncident={hasIncident}
              isResolved={isResolved}
              onSelectGreenhouse={navigateToGreenhouse}
              onOpenControlPanel={() => setIsControlPanelOpen(true)}
            />
          ) : (
            <GreenhouseScene
              key="greenhouse"
              isResolved={isResolved}
              onActivateEmergencyCooling={handleActivateEmergencyCooling}
              onReturnToBase={navigateToBase}
              isCoolingActive={isCoolingActive}
              currentTemp={currentTemp}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 3. Panel de Control Desplegable */}
      <ControlPanelDrawer
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        resources={resources}
        greenhouseStatus={isResolved || !hasIncident ? 'OPERATIVO' : 'ERROR'}
        onNavigateToGreenhouse={navigateToGreenhouse}
      />

      {/* 4. Personaje: Segundo al Mando (Oficial de Operaciones) */}
      <OfficerDialogue
        isOpen={isOfficerOpen}
        message={officerMessage}
        badgeText={officerBadge}
        actions={dialogueActions}
        onClose={() => setIsOfficerOpen(false)}
      />
    </div>
  );
}

/**
 * @file App.tsx
 * @description Maqueta interactiva del videojuego educativo de simulación espacial UNIVERSE.
 * Manejo de pantalla de bienvenida 3D, mapa base lunar, invernadero, diálogos del oficial y recursos.
 */

import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
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

type ActiveScene = 'WELCOME' | 'BASE' | 'GREENHOUSE';

export default function App() {
  // Escena activa: inicia en WELCOME como especifica la solicitud
  const [currentScene, setCurrentScene] = useState<ActiveScene>('WELCOME');

  // Estado del incidente y resolución
  const [hasIncident, setHasIncident] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [isCoolingActive, setIsCoolingActive] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(INCIDENT_CONFIG.initialTemp);

  // Únicamente tres recursos principales (Energía, Oxígeno, Agua)
  const [resources, setResources] = useState<ResourceState>(INITIAL_RESOURCES);

  // Reloj de tiempo simulado
  const [simTime, setSimTime] = useState<string>(MISSION_METADATA.initialSimTime);

  // Panel de control desplegable
  const [isControlPanelOpen, setIsControlPanelOpen] = useState<boolean>(false);

  // Diálogo del Oficial
  const [isOfficerOpen, setIsOfficerOpen] = useState<boolean>(false);
  const [officerMessage, setOfficerMessage] = useState<string>('');
  const [officerBadge, setOfficerBadge] = useState<string>('SEGUNDO AL MANDO');
  const [dialogueActions, setDialogueActions] = useState<DialogueAction[]>([]);

  // Toggle de sonido
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Temporizadores
  const coolingIntervalRef = useRef<number | null>(null);
  const incidentTimerRef = useRef<number | null>(null);

  /**
   * 1. Al pulsar EMPEZAR A JUGAR en la pantalla de bienvenida
   */
  const handleStartGame = () => {
    setCurrentScene('BASE');
    setSimTime(MISSION_METADATA.initialSimTime);

    // Tras unos instantes, el segundo al mando comunica la emergencia térmica
    if (incidentTimerRef.current) {
      window.clearTimeout(incidentTimerRef.current);
    }
    incidentTimerRef.current = window.setTimeout(() => {
      triggerIncident();
    }, INCIDENT_CONFIG.delayBeforeIncidentTriggerMs);
  };

  /**
   * 2. Detonación de la emergencia térmica en el invernadero
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
   * 3. Navegar hacia el interior del Invernadero
   */
  const navigateToGreenhouse = () => {
    setIsControlPanelOpen(false);
    setCurrentScene('GREENHOUSE');
    sfx.transition();

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
   * 4. Regresar a la pantalla panorámica de la base lunar
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
   * 5. Activar refrigeración de emergencia:
   * - Temperatura desciende de 34 °C a 25 °C
   * - El invernadero cambia a OPERATIVO
   * - Energía disminuye de 78 % a 73 % (-5 %)
   * - Agua disminuye de 85 % a 82 % (-3 %)
   * - Oxígeno permanece en 96 %
   */
  const handleActivateEmergencyCooling = () => {
    if (isResolved || isCoolingActive) return;

    setIsCoolingActive(true);
    setIsOfficerOpen(false);

    let temp = INCIDENT_CONFIG.initialTemp;
    const target = INCIDENT_CONFIG.targetTemp;
    const totalSteps = temp - target;
    const stepDuration = INCIDENT_CONFIG.emergencyCoolingDurationMs / totalSteps;

    // Recursos iniciales para interpolación
    const startEnergy = INITIAL_RESOURCES.energy;
    const endEnergy = RESOLVED_RESOURCES.energy;
    const startWater = INITIAL_RESOURCES.water;
    const endWater = RESOLVED_RESOURCES.water;

    if (coolingIntervalRef.current) {
      window.clearInterval(coolingIntervalRef.current);
    }

    let currentStep = 0;

    coolingIntervalRef.current = window.setInterval(() => {
      currentStep += 1;
      temp -= 1;
      setCurrentTemp(temp);

      // Actualizar progresivamente los recursos en pantalla
      const progress = currentStep / totalSteps;
      const interpolatedEnergy = Math.round(startEnergy - (startEnergy - endEnergy) * progress);
      const interpolatedWater = Math.round(startWater - (startWater - endWater) * progress);

      setResources({
        energy: interpolatedEnergy,
        oxygen: 96,
        water: interpolatedWater,
      });

      if (temp <= target) {
        if (coolingIntervalRef.current) {
          window.clearInterval(coolingIntervalRef.current);
          coolingIntervalRef.current = null;
        }

        // Resolución completada
        setIsCoolingActive(false);
        setIsResolved(true);
        setResources(RESOLVED_RESOURCES);
        setSimTime('01:20 / 48:00');
        sfx.success();

        // Diálogo de confirmación del oficial (máximo dos frases)
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
   * 6. Reiniciar toda la demostración y regresar a la pantalla de bienvenida
   */
  const handleResetToWelcome = () => {
    if (coolingIntervalRef.current) {
      window.clearInterval(coolingIntervalRef.current);
      coolingIntervalRef.current = null;
    }
    if (incidentTimerRef.current) {
      window.clearTimeout(incidentTimerRef.current);
      incidentTimerRef.current = null;
    }

    setCurrentScene('WELCOME');
    setHasIncident(false);
    setIsResolved(false);
    setIsCoolingActive(false);
    setCurrentTemp(INCIDENT_CONFIG.initialTemp);
    setResources(INITIAL_RESOURCES);
    setSimTime(MISSION_METADATA.initialSimTime);
    setIsControlPanelOpen(false);
    setIsOfficerOpen(false);
  };

  const handleToggleMute = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans">
      <AnimatePresence mode="wait">
        {currentScene === 'WELCOME' ? (
          /* Pantalla de Bienvenida Independiente con Luna 3D */
          <WelcomeScreen key="welcome" onStartGame={handleStartGame} />
        ) : (
          <div key="game" className="relative w-full h-full flex flex-col">
            {/* Cabecera del Juego */}
            <Header
              simTime={simTime}
              hasIncident={hasIncident}
              isResolved={isResolved}
              onOpenControlPanel={() => setIsControlPanelOpen(true)}
              onResetToWelcome={handleResetToWelcome}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />

            {/* Escenario Activo */}
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
                    resources={resources}
                  />
                )}
              </AnimatePresence>
            </main>

            {/* Panel de Control Desplegable (Únicamente 3 recursos) */}
            <ControlPanelDrawer
              isOpen={isControlPanelOpen}
              onClose={() => setIsControlPanelOpen(false)}
              resources={resources}
              greenhouseStatus={isResolved || !hasIncident ? 'OPERATIVO' : 'ERROR'}
              onNavigateToGreenhouse={navigateToGreenhouse}
            />

            {/* Segundo al Mando (Oficial de Operaciones) */}
            <OfficerDialogue
              isOpen={isOfficerOpen}
              message={officerMessage}
              badgeText={officerBadge}
              actions={dialogueActions}
              onClose={() => setIsOfficerOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

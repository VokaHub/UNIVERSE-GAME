/**
 * @file missionConfig.ts
 * @description OUTPOST: Simulación interactiva de estación científica lunar desarrollada por el equipo UNIVERSE para NASA Space Apps Challenge.
 * 
 * NOTA TÉCNICA Y CIENTÍFICA:
 * Los valores de recursos (energía, oxígeno y agua) y temperatura aquí expuestos
 * son FICTICIOS y exclusivamente demostrativos para esta maqueta interactiva.
 * En una versión científica posterior, estos valores se sustituirán por modelos
 * de simulación ECLSS y balances de masa/energía validados por NASA / ESA.
 */

export interface ResourceState {
  energy: number; // Porcentaje (%)
  oxygen: number; // Porcentaje (%)
  water: number;  // Porcentaje (%)
}

export type ModuleStatus = 'OPERATIVO' | 'ERROR' | 'ADVERTENCIA';

export interface BaseModule {
  id: string;
  name: string;
  code: string;
  status: ModuleStatus;
}

export const WELCOME_CONFIG = {
  teamName: 'UNIVERSE',
  gameTitle: 'OUTPOST',
  subtitle: 'EVERY CHOICE HAS A COST',
  missionTagline: '48 horas para mantener viva tu misión',
  ctaButton: 'EMPEZAR A JUGAR',
};

export const MISSION_METADATA = {
  name: 'OUTPOST',
  team: 'UNIVERSE',
  location: 'POLO SUR LUNAR',
  sublocation: 'Cráter Shackleton (89.9° S, 0.0° E)',
  commanderRole: 'Comandante de la Misión',
  officerRole: 'Segundo al Mando',
  officerName: 'Oficial Elena Cruz',
  totalHours: 48,
  initialSimTime: '00:00 / 48:00',
  activeSimTime: '01:15 / 48:00',
  objective: 'Mantener la base y la tripulación operativas durante las 48 horas de la misión.',
  disclaimer: 'Valores ficticios para maqueta operativa interactiva. No constituyen datos científicos oficiales de NASA.',
};

/**
 * Recursos multimedia (imágenes limpias de la base, interior e interlocutor).
 */
export const ASSET_IMAGES = {
  lunarBase: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671478/base-lunar.jpg',
  greenhouse: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671511/invernadero.jpg',
  controlRoom: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671449/sala-control.jpg',
  officer: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671418/segundo-al-mando.png',
};

/**
 * RECURSOS INICIALES (ÚNICAMENTE TRES RECURSOS: ENERGÍA, OXÍGENO, AGUA).
 * VALORES FICTICIOS Y EXCLUSIVAMENTE DEMOSTRATIVOS.
 */
export const INITIAL_RESOURCES: ResourceState = {
  energy: 78, // %
  oxygen: 96, // %
  water: 85,  // %
};

/**
 * CONSECUENCIAS DE LA DECISIÓN DE REFRIGERACIÓN DE EMERGENCIA:
 * Al activar la refrigeración de emergencia:
 * - La energía disminuye de 78 % a 73 % (-5 %).
 * - El agua disminuye de 85 % a 82 % (-3 % por consumo del circuito térmico).
 * - El oxígeno permanece en 96 %.
 */
export const RESOLVED_RESOURCES: ResourceState = {
  energy: 73, // %
  oxygen: 96, // % (permanece igual)
  water: 82,  // %
};

/**
 * Parámetros del único incidente térmico en el invernadero.
 */
export const INCIDENT_CONFIG = {
  id: 'INC-AGRO-702',
  moduleName: 'INVERNADERO',
  moduleCode: 'AGRO-01',
  initialTemp: 34,    // °C al producirse el fallo
  targetTemp: 25,     // °C tras estabilización con sistema de emergencia
  nominalRange: { min: 20, max: 26 }, // Rango seguro para cultivos lunares (°C)
  emergencyCoolingDurationMs: 2400,   // Duración de la animación de enfriamiento progresivo
  delayBeforeIncidentTriggerMs: 1600, // Retardo al arrancar la base antes del aviso del segundo al mando
  
  // Diálogos breves (máximo dos frases cortas y directas en español)
  dialogues: {
    alert: '¡Comandante, el invernadero se está sobrecalentando! Tenemos que activar la refrigeración de emergencia.',
    guidance: 'Revise el panel de control o entre directamente al módulo para intervenir.',
    greenhouseBriefing: 'El compresor principal falló y alcanzamos los 34 °C. ¡Active el sistema de emergencia para salvar los cultivos!',
    stabilized: '¡Temperatura estabilizada a 25 °C! La refrigeración extra redujo la energía al 73 % y el agua al 82 %.',
    incidentResolvedBase: '¡Incidente resuelto, comandante! Todos los sistemas de la base continúan operativos.',
  },
};

/**
 * Módulos y sistemas de la base representados en el panel de control.
 */
export const BASE_SYSTEMS: BaseModule[] = [
  {
    id: 'greenhouse',
    name: 'Invernadero Biológico',
    code: 'AGRO-01',
    status: 'ERROR', // Cambia dinámicamente a OPERATIVO al resolverse
  },
  {
    id: 'power',
    name: 'Red Eléctrica',
    code: 'PWR-ARRAY',
    status: 'OPERATIVO',
  },
  {
    id: 'oxygen',
    name: 'Soporte de Oxígeno',
    code: 'ECLSS-O2',
    status: 'OPERATIVO',
  },
  {
    id: 'water',
    name: 'Circuito Hídrico',
    code: 'H2O-LOOP',
    status: 'OPERATIVO',
  },
  {
    id: 'habitat',
    name: 'Módulo Hábitat',
    code: 'HAB-01',
    status: 'OPERATIVO',
  },
];

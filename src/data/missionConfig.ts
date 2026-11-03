/**
 * @file missionConfig.ts
 * @description Configuración narrativa, parámetros de simulación y diálogos del videojuego educativo OUTPOST.
 * 
 * NOTA TÉCNICA Y CIENTÍFICA:
 * Los valores de recursos (energía, oxígeno, agua, alimentos y temperatura) aquí expuestos
 * son FICTICIOS y han sido simplificados con fines lúdicos y pedagógicos para esta maqueta.
 * En una versión científica posterior, estos valores se vincularían con modelos de simulación ECLSS
 * (Environmental Control and Life Support System) y balances de masa/energía validados por NASA / ESA.
 */

export interface ResourceState {
  energy: number; // Porcentaje (%)
  oxygen: number; // Porcentaje (%)
  water: number;  // Porcentaje (%)
  food: number;   // Porcentaje (%)
}

export type ModuleStatus = 'OPERATIVO' | 'ERROR' | 'ADVERTENCIA';

export interface BaseModule {
  id: string;
  name: string;
  code: string;
  description: string;
  status: ModuleStatus;
  x: number; // Coordenada porcentual horizontal en el mapa de la base (0-100)
  y: number; // Coordenada porcentual vertical en el mapa de la base (0-100)
}

export const MISSION_METADATA = {
  name: 'OUTPOST',
  location: 'POLO SUR LUNAR',
  sublocation: 'Borde del Cráter Shackleton (89.9° S, 0.0° E)',
  commanderRole: 'Comandante de la Misión',
  officerRole: 'Segundo al Mando / Oficial de Operaciones',
  officerName: 'Oficial Elena Cruz',
  totalHours: 48,
  initialSimTime: '00:00 / 48:00',
  activeSimTime: '01:15 / 48:00',
  objective: 'Mantener la base y la tripulación operativas durante las 48 horas de la misión.',
  disclaimer: 'Valores y parámetros ficticios para maqueta operativa interactiva. No constituyen datos científicos oficiales de NASA.',
};

/**
 * Recursos multimedia provistos por el usuario.
 */
export const ASSET_IMAGES = {
  lunarBase: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671478/base-lunar.jpg',
  greenhouse: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671511/invernadero.jpg',
  controlRoom: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671449/sala-control.jpg',
  officer: 'https://res.cloudinary.com/uelrhbi7/image/upload/v1793671418/segundo-al-mando.png',
};

/**
 * Recursos iniciales de la base.
 * VALORES FICTICIOS PARA LA DEMOSTRACIÓN.
 */
export const INITIAL_RESOURCES: ResourceState = {
  energy: 78, // % inicial
  oxygen: 96, // % nominal
  water: 85,  // % nominal
  food: 72,   // % nominal
};

/**
 * Consecuencias del incidente de refrigeración de emergencia:
 * Al activar la refrigeración de emergencia, el consumo adicional reduce la energía de 78% a 73%.
 */
export const RESOLVED_RESOURCES: ResourceState = {
  energy: 73, // % posterior a la resolución (-5% por sobrecarga de refrigeración de emergencia)
  oxygen: 96,
  water: 85,
  food: 72,
};

/**
 * Parámetros del incidente térmico en el invernadero.
 */
export const INCIDENT_CONFIG = {
  id: 'INC-AGRO-702',
  moduleName: 'INVERNADERO',
  moduleCode: 'MÓDULO AGRO-01',
  initialTemp: 34,    // °C al producirse el fallo
  targetTemp: 25,     // °C tras estabilización con sistema de emergencia
  nominalRange: { min: 20, max: 26 }, // Rango seguro para cultivos lunares (°C)
  emergencyCoolingDurationMs: 2400,   // Duración de la animación de enfriamiento progresivo
  delayBeforeIncidentTriggerMs: 1500, // Retardo al arrancar antes de que el oficial informe
  
  // Textos y diálogos simplificados del segundo al mando (máximo 2 frases directas y naturales)
  dialogues: {
    // Alarma inicial en la pantalla principal
    alert: '¡Comandante, el invernadero se está sobrecalentando! Tenemos que activar la refrigeración de emergencia.',
    // Instrucción para proceder
    guidance: 'Revise el panel de control o entre directamente al módulo para intervenir.',
    // Dentro del invernadero
    greenhouseBriefing: 'El compresor principal falló y alcanzamos los 34 °C. ¡Active el sistema de emergencia para salvar los cultivos!',
    // Tras activar la refrigeración de emergencia
    stabilized: '¡Temperatura estabilizada a 25 °C! La refrigeración extra consumió energía y la reserva bajó al 73%.',
    // Al regresar a la base panorámica
    incidentResolvedBase: '¡Incidente resuelto, comandante! Todos los sistemas de la base vuelven a estar operativos.',
  },
};

/**
 * Módulos de la base lunar para representación en el mapa y panel de control.
 */
export const OUTPOST_MODULES: BaseModule[] = [
  {
    id: 'greenhouse',
    name: 'Invernadero Biológico',
    code: 'AGRO-01',
    description: 'Producción de alimentos hidropónicos y reciclaje biológico de CO2.',
    status: 'ERROR', // Cambia dinámicamente con el estado del incidente
    x: 63, // Ubicado visualmente sobre el domo agrícola
    y: 52,
  },
  {
    id: 'habitat',
    name: 'Módulo Habitacional',
    code: 'HAB-01',
    description: 'Alojamiento para 6 tripulantes, camarotes y áreas comunes.',
    status: 'OPERATIVO',
    x: 44,
    y: 65,
  },
  {
    id: 'power',
    name: 'Planta de Energía Solar',
    code: 'PWR-ARRAY',
    description: 'Generación fotovoltaica y celdas regenerativas de combustible.',
    status: 'OPERATIVO',
    x: 28,
    y: 42,
  },
  {
    id: 'comm',
    name: 'Antena de Espacio Profundo',
    code: 'COMM-DSN',
    description: 'Enlace bidireccional con el Centro de Control de Misión en la Tierra.',
    status: 'OPERATIVO',
    x: 78,
    y: 38,
  },
  {
    id: 'life_support',
    name: 'Soporte Vital Central',
    code: 'ECLSS-01',
    description: 'Regeneración atmosférica, scrubbers de CO2 y purificación hídrica.',
    status: 'OPERATIVO',
    x: 50,
    y: 48,
  },
];

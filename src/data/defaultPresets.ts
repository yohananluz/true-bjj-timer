import type { TimerPreset } from '../types/timer';

export const DEFAULT_PRESETS: TimerPreset[] = [
  {
    id: 'rola-livre-6m',
    name: 'Rola Livre (Adulto)',
    category: 'adulto',
    description: 'Padrão tradicional de academia: 6 min de rola com 1 min de descanso.',
    config: {
      rounds: 5,
      rollTime: 6 * 60, // 6 min
      restTime: 60,     // 1 min
      prepareTime: 5,   // 5 seg
      warningTime: 10,  // 10 seg
      soundEnabled: true,
    },
  },
  {
    id: 'ibjjf-faixa-roxa',
    name: 'Competição (Azul / Roxa)',
    category: 'competicao',
    description: 'Tempo oficial de luta IBJJF para faixas coloridas adultas (6 a 7 min).',
    config: {
      rounds: 5,
      rollTime: 7 * 60, // 7 min
      restTime: 90,     // 1:30 min
      prepareTime: 5,
      warningTime: 15,
      soundEnabled: true,
    },
  },
  {
    id: 'ibjjf-faixa-preta',
    name: 'Competição (Marrom / Preta)',
    category: 'competicao',
    description: 'Tempo oficial de luta IBJJF adulto Faixa Preta (10 min de combate).',
    config: {
      rounds: 3,
      rollTime: 10 * 60, // 10 min
      restTime: 2 * 60,  // 2 min
      prepareTime: 10,
      warningTime: 30,
      soundEnabled: true,
    },
  },
  {
    id: 'treino-kids',
    name: 'Treino Kids / Infantil',
    category: 'kids',
    description: 'Rounds mais curtos adaptados para a criançada manter a concentração e o ritmo.',
    config: {
      rounds: 4,
      rollTime: 3 * 60, // 3 min
      restTime: 60,     // 1 min
      prepareTime: 5,
      warningTime: 10,
      soundEnabled: true,
    },
  },
  {
    id: 'drills-especifico',
    name: 'Drills / Treino Específico',
    category: 'drills',
    description: 'Passagem x Guarda ou saídas de finalização em alta intensidade com troca rápida.',
    config: {
      rounds: 8,
      rollTime: 2 * 60, // 2 min
      restTime: 30,     // 30 seg
      prepareTime: 5,
      warningTime: 10,
      soundEnabled: true,
    },
  },
  {
    id: 'tabata-fisico',
    name: 'Tabata / Preparatório',
    category: 'condicionamento',
    description: 'Aquecimento e gás: 20 seg de explosão máxima e 10 seg de descanso.',
    config: {
      rounds: 8,
      rollTime: 20,
      restTime: 10,
      prepareTime: 5,
      warningTime: 3,
      soundEnabled: true,
    },
  },
  {
    id: 'infinito-livre',
    name: 'Rola Contínuo (Sem Limite)',
    category: 'adulto',
    description: 'Rounds contínuos de 5 min sem limite de rounds definido (até parar manualmente).',
    config: {
      rounds: 0, // 0 = infinito
      rollTime: 5 * 60,
      restTime: 45,
      prepareTime: 5,
      warningTime: 10,
      soundEnabled: true,
    },
  },
];

export type TimerPhase = 
  | 'idle'      // Pronto para iniciar
  | 'prepare'   // Contagem regressiva inicial (ex: 5s "PREPARE-SE")
  | 'roll'      // Tempo de luta / rola ativo
  | 'warning'   // Últimos segundos do rola (ex: 10s - batedor de madeira)
  | 'rest'      // Tempo de descanso entre rounds
  | 'finished'; // Treino/todos os rounds completados

export interface TimerConfig {
  rounds: number;        // Total de rounds (0 = infinito / rola contínuo)
  rollTime: number;      // Tempo de luta em segundos (ex: 360 = 6 min)
  restTime: number;      // Tempo de descanso em segundos (ex: 60 = 1 min)
  prepareTime: number;   // Tempo de preparação antes do round (ex: 5 seg)
  warningTime: number;   // Tempo para alerta sonoro antes de acabar (ex: 10 seg)
  soundEnabled: boolean; // Alertas sonoros ativados
}

export interface TimerPreset {
  id: string;
  name: string;
  category: 'adulto' | 'competicao' | 'kids' | 'drills' | 'condicionamento';
  description: string;
  config: TimerConfig;
}

export interface TimerState {
  phase: TimerPhase;
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  phaseDuration: number;
  totalElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
}


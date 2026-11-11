import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerConfig, TimerPhase } from '../types/timer';
import { soundService } from '../services/soundService';
import { wakeLockService } from '../services/wakeLockService';

export function useBjjTimer(initialConfig: TimerConfig) {
  const [config, setConfig] = useState<TimerConfig>(initialConfig);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(initialConfig.rollTime);
  const [phaseDuration, setPhaseDuration] = useState<number>(initialConfig.rollTime);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);

  // Referências para precisão sem drift
  const endTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(initialConfig.rollTime * 1000);
  const lastClapperPlayedRoundRef = useRef<number | null>(null);
  const lastCountdownBeepRef = useRef<number | null>(null);
  const lastPrepareWhistleSecRef = useRef<number | null>(null);
  const lastWarningWhistleSecRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Atualizar quando a config mudar se estiver no estado 'idle'
  useEffect(() => {
    if (phase === 'idle') {
      setTimeRemaining(config.rollTime);
      setPhaseDuration(config.rollTime);
      remainingMsRef.current = config.rollTime * 1000;
    }
  }, [config, phase]);

  // Sincronizar estado de mute
  useEffect(() => {
    soundService.setMuted(isMuted);
  }, [isMuted]);

  // Transição de fases
  const transitionToPhase = useCallback((newPhase: TimerPhase, nextRoundNum?: number) => {
    if (nextRoundNum !== undefined) {
      setCurrentRound(nextRoundNum);
    }
    setPhase(newPhase);

    let durationSec = 0;
    switch (newPhase) {
      case 'prepare':
        durationSec = config.prepareTime;
        break;
      case 'roll':
      case 'warning':
        durationSec = config.rollTime;
        soundService.playStartGong();
        break;
      case 'rest':
        durationSec = config.restTime;
        soundService.playEndHorn();
        break;
      case 'finished':
        durationSec = 0;
        soundService.playWorkoutComplete();
        wakeLockService.releaseLock();
        setWakeLockActive(false);
        setIsRunning(false);
        setIsPaused(false);
        break;
      case 'idle':
        durationSec = config.rollTime;
        wakeLockService.releaseLock();
        setWakeLockActive(false);
        setIsRunning(false);
        setIsPaused(false);
        break;
    }

    setPhaseDuration(durationSec);
    setTimeRemaining(durationSec);
    remainingMsRef.current = durationSec * 1000;
    endTimeRef.current = Date.now() + durationSec * 1000;

    // Reset de flags de som deste round
    if (newPhase === 'roll') {
      lastClapperPlayedRoundRef.current = null;
    }
    lastCountdownBeepRef.current = null;
    lastPrepareWhistleSecRef.current = null;
    lastWarningWhistleSecRef.current = null;
  }, [config, currentRound]);

  // Avançar para próximo passo do treino
  const handlePhaseCompletion = useCallback(() => {
    if (phase === 'prepare') {
      transitionToPhase('roll', 1);
    } else if (phase === 'roll' || phase === 'warning') {
      // Checar se o treino tem limite de rounds e chegou ao fim
      const isLastRound = config.rounds > 0 && currentRound >= config.rounds;
      if (isLastRound) {
        transitionToPhase('finished');
      } else {
        if (config.restTime > 0) {
          transitionToPhase('rest');
        } else {
          // Sem descanso: vai direto para próximo round
          setCurrentRound(prev => prev + 1);
          transitionToPhase('roll', currentRound + 1);
        }
      }
    } else if (phase === 'rest') {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      transitionToPhase('roll', nextRound);
    }
  }, [phase, config, currentRound, transitionToPhase]);

  // Loop de alta precisão
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const diffMs = endTimeRef.current - now;

      if (diffMs <= 0) {
        setTimeRemaining(0);
        handlePhaseCompletion();
        return;
      }

      const secondsLeft = Math.ceil(diffMs / 1000);
      setTimeRemaining(secondsLeft);
      remainingMsRef.current = diffMs;

      // 1. Apito de Alerta nos últimos 5 segundos do Tempo de Preparo (5, 4, 3, 2, 1)
      if (phase === 'prepare' && secondsLeft <= 5 && secondsLeft > 0) {
        if (lastPrepareWhistleSecRef.current !== secondsLeft) {
          lastPrepareWhistleSecRef.current = secondsLeft;
          soundService.playWhistleAlert(secondsLeft === 1);
        }
      }

      // 2. Apito de Alerta a cada segundo nos 10 segundos finais de cada round (10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
      if ((phase === 'roll' || phase === 'warning') && secondsLeft <= 10 && secondsLeft > 0) {
        if (phase !== 'warning') {
          setPhase('warning');
        }
        if (lastWarningWhistleSecRef.current !== secondsLeft) {
          lastWarningWhistleSecRef.current = secondsLeft;
          soundService.playWhistleAlert(secondsLeft === 1);
        }
        if (secondsLeft === 10 && lastClapperPlayedRoundRef.current !== currentRound) {
          lastClapperPlayedRoundRef.current = currentRound;
          soundService.playClapper();
        }
      }

      // Atualizar total de tempo decorrido
      setTotalElapsed(prev => prev + 1);
    }, 250);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, phase, config.warningTime, currentRound, handlePhaseCompletion]);

  // Iniciar timer
  const start = useCallback(() => {
    // Inicializar e desuspender áudio sincronamente com o clique na TV/celular
    soundService.resumeAudioContext();

    // Requisitar Wake Lock em segundo plano sem travar execução na Smart TV
    wakeLockService.requestLock().then(setWakeLockActive).catch(() => {});

    setIsRunning(true);
    setIsPaused(false);

    if (phase === 'idle') {
      setCurrentRound(1);
      setTotalElapsed(0);
      if (config.prepareTime > 0) {
        transitionToPhase('prepare', 1);
      } else {
        transitionToPhase('roll', 1);
      }
    } else {
      // Se estava pausado, reativa com tempo restante
      endTimeRef.current = Date.now() + remainingMsRef.current;
    }
  }, [config.prepareTime, phase, transitionToPhase]);

  // Pausar
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    if (endTimeRef.current) {
      remainingMsRef.current = Math.max(0, endTimeRef.current - Date.now());
    }
    setIsPaused(true);
  }, [isRunning, isPaused]);

  // Retomar
  const resume = useCallback(() => {
    soundService.resumeAudioContext();
    if (!isRunning || !isPaused) return;
    endTimeRef.current = Date.now() + remainingMsRef.current;
    setIsPaused(false);
  }, [isRunning, isPaused]);

  // Alternar Play/Pause
  const togglePlayPause = useCallback(() => {
    soundService.resumeAudioContext();
    if (!isRunning || phase === 'idle' || phase === 'finished') {
      start();
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isRunning, isPaused, phase, start, resume, pause]);

  // Resetar
  const reset = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    wakeLockService.releaseLock();
    setWakeLockActive(false);
    setIsRunning(false);
    setIsPaused(false);
    setPhase('idle');
    setCurrentRound(1);
    setTotalElapsed(0);
    setTimeRemaining(config.rollTime);
    setPhaseDuration(config.rollTime);
    remainingMsRef.current = config.rollTime * 1000;
    endTimeRef.current = null;
    lastClapperPlayedRoundRef.current = null;
    lastCountdownBeepRef.current = null;
    lastPrepareWhistleSecRef.current = null;
    lastWarningWhistleSecRef.current = null;
  }, [config.rollTime]);

  // Pular para o próximo round ou fase
  const skipNext = useCallback(() => {
    if (phase === 'idle') {
      start();
      return;
    }
    if (phase === 'prepare') {
      transitionToPhase('roll', 1);
    } else if (phase === 'roll' || phase === 'warning') {
      const isLastRound = config.rounds > 0 && currentRound >= config.rounds;
      if (isLastRound) {
        transitionToPhase('finished');
      } else if (config.restTime > 0) {
        transitionToPhase('rest');
      } else {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        transitionToPhase('roll', nextRound);
      }
    } else if (phase === 'rest') {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      transitionToPhase('roll', nextRound);
    }
  }, [phase, config, currentRound, start, transitionToPhase]);

  // Voltar / Reiniciar round atual
  const skipPrevious = useCallback(() => {
    if (phase === 'roll' || phase === 'warning') {
      // Reinicia o round atual
      transitionToPhase('roll', currentRound);
    } else if (phase === 'rest') {
      // Volta para o rola anterior
      transitionToPhase('roll', currentRound);
    } else if (currentRound > 1) {
      const prevRound = currentRound - 1;
      setCurrentRound(prevRound);
      transitionToPhase('roll', prevRound);
    } else {
      reset();
    }
  }, [phase, currentRound, transitionToPhase, reset]);

  // Adicionar 1 minuto em tempo de execução
  const addMinute = useCallback(() => {
    if (phase === 'idle' || phase === 'finished') return;
    remainingMsRef.current += 60 * 1000;
    if (endTimeRef.current) {
      endTimeRef.current += 60 * 1000;
    }
    setTimeRemaining(prev => prev + 60);
    setPhaseDuration(prev => prev + 60);
  }, [phase]);

  // Subtrair 1 minuto em tempo de execução
  const subtractMinute = useCallback(() => {
    if (phase === 'idle' || phase === 'finished') return;
    if (timeRemaining <= 15) return;
    const toSubtract = Math.min(60, timeRemaining - 5);
    remainingMsRef.current -= toSubtract * 1000;
    if (endTimeRef.current) {
      endTimeRef.current -= toSubtract * 1000;
    }
    setTimeRemaining(prev => prev - toSubtract);
  }, [phase, timeRemaining]);

  // Alternar Mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Atalhos de teclado (Teclado de PC e Controle Remoto de Smart TV)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar captura se o usuário estiver digitando em um input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const code = e.code || '';
      const key = e.key || '';
      const keyCode = e.keyCode || 0;

      // Play / Pause: Barra de Espaço, teclas de controle remoto de TV (Play/Pause/OK)
      if (
        code === 'Space' ||
        key === ' ' ||
        code === 'MediaPlayPause' ||
        key === 'MediaPlayPause' ||
        code === 'MediaPlay' ||
        key === 'MediaPlay' ||
        key === 'Play' ||
        key === 'Pause' ||
        keyCode === 179 ||
        keyCode === 19
      ) {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Tecla Enter no controle da Smart TV: se o foco não estiver em outro botão interativo, aciona Play/Pause
      if (
        (code === 'Enter' || key === 'Enter' || keyCode === 13) &&
        (!document.activeElement || document.activeElement === document.body || document.activeElement.tagName === 'MAIN')
      ) {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      // Resetar Treino (Tecla R)
      if (code === 'KeyR' || key === 'r' || key === 'R') {
        reset();
        return;
      }

      // Próximo Round / Pular (Tecla N) - NÃO interceptar setas do controle para permitir navegação
      if (code === 'KeyN' || key === 'n' || key === 'N') {
        skipNext();
        return;
      }

      // Round Anterior (Tecla P)
      if (code === 'KeyP' || key === 'p' || key === 'P') {
        skipPrevious();
        return;
      }

      // Mutar / Desmutar (Tecla M)
      if (code === 'KeyM' || key === 'm' || key === 'M') {
        toggleMute();
        return;
      }

      // +1 Minuto
      if (code === 'Equal' || key === '+' || code === 'NumpadAdd') {
        addMinute();
        return;
      }

      // -1 Minuto
      if (code === 'Minus' || key === '-' || code === 'NumpadSubtract') {
        subtractMinute();
        return;
      }

      // Tela Cheia (Tecla F)
      if (code === 'KeyF' || key === 'f' || key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, reset, skipNext, skipPrevious, toggleMute, addMinute, subtractMinute]);

  return {
    state: {
      phase,
      currentRound,
      totalRounds: config.rounds,
      timeRemaining,
      phaseDuration,
      totalElapsed,
      isRunning,
      isPaused,
    },
    config,
    setConfig,
    isMuted,
    wakeLockActive,
    actions: {
      start,
      pause,
      resume,
      togglePlayPause,
      reset,
      skipNext,
      skipPrevious,
      addMinute,
      subtractMinute,
      toggleMute,
    },
  };
}

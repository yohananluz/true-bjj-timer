import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sliders, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { TimerPhase } from '../types/timer';

interface ControlsProps {
  phase: TimerPhase;
  isRunning: boolean;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePlayPause: () => void;
  onReset: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onAddMinute: () => void;
  onSubtractMinute: () => void;
  onToggleMute: () => void;
  onOpenPresets: () => void;
  onOpenSettings: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  phase,
  isRunning,
  isPaused,
  isMuted,
  onTogglePlayPause,
  onReset,
  onSkipNext,
  onSkipPrevious,
  onAddMinute,
  onSubtractMinute,
  onToggleMute,
  onOpenPresets,
  onOpenSettings,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Erro ao alternar tela cheia:', err);
    }
  };

  const isPlayState = !isRunning || isPaused || phase === 'idle' || phase === 'finished';

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4">
      {/* Grupo Esquerda: Presets & Configurações */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPresets}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-semibold shadow-sm"
          title="Selecionar Modalidades de Jiu-Jitsu"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Modalidades</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-semibold shadow-sm"
          title="Ajustar Tempos Personalizados"
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Configurar</span>
        </button>
      </div>

      {/* Grupo Central: Botões Principais de Ação do Tatame */}
      <div className="flex items-center gap-2 sm:gap-3 mx-auto">
        {/* Voltar / Reiniciar Round */}
        <button
          onClick={onSkipPrevious}
          className="p-3 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition active:scale-95"
          title="Reiniciar Round Atual / Voltar (P)"
        >
          <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Botão Gigante Play/Pause */}
        <button
          onClick={onTogglePlayPause}
          className={`px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-3 transition-all duration-150 active:scale-95 shadow-lg ${
            isPlayState
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
          }`}
          title="Iniciar / Pausar (Barra de Espaço)"
        >
          {isPlayState ? (
            <>
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
              <span>INICIAR</span>
            </>
          ) : (
            <>
              <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
              <span>PAUSAR</span>
            </>
          )}
        </button>

        {/* Avançar Próximo Round */}
        <button
          onClick={onSkipNext}
          className="p-3 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition active:scale-95"
          title="Próximo Round / Pular Descanso (N)"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Resetar Treino */}
        <button
          onClick={onReset}
          className="p-3 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition active:scale-95"
          title="Resetar Treino Completo (R)"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Grupo Direita: Ajustes Rápidos (+/- 1 Min, Mute, Tela Cheia) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* +1 Minuto (Muito comum em rolas de academia) */}
        <button
          onClick={onAddMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-emerald-400 border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-bold flex items-center gap-1"
          title="Adicionar 1 minuto ao rola (+)"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>1m</span>
        </button>

        {/* -1 Minuto */}
        <button
          onClick={onSubtractMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-400 border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-bold flex items-center gap-1"
          title="Subtrair 1 minuto do rola (-)"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>1m</span>
        </button>

        {/* Mudo / Som */}
        <button
          onClick={onToggleMute}
          className={`p-2.5 sm:p-3 rounded-2xl border transition active:scale-95 ${
            isMuted 
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-400' 
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
          }`}
          title={isMuted ? 'Desmutar Sons (M)' : 'Mutar Sons (M)'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Tela Cheia (TV / Monitor) */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 sm:p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition active:scale-95"
          title="Modo Tela Cheia para Smart TV / Monitor (F)"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};


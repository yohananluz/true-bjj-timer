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
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 pt-1 sm:pt-4 flex-shrink-0">
      {/* Desktop / TV: Grupo Esquerda (Modalidades & Config) */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPresets}
          className="cursor-pointer pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105"
          title="Selecionar Modalidades de Jiu-Jitsu"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Modalidades</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="cursor-pointer pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105"
          title="Ajustar Tempos Personalizados"
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Configurar</span>
        </button>
      </div>

      {/* Grupo Principal de Ação do Tatame (Mobile & Desktop) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
        {/* Voltar / Reiniciar Round */}
        <button
          type="button"
          onClick={onSkipPrevious}
          className="cursor-pointer pointer-events-auto p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105"
          title="Reiniciar Round Atual / Voltar (P)"
          aria-label="Voltar round"
        >
          <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Botão Gigante Play/Pause */}
        <button
          type="button"
          onClick={onTogglePlayPause}
          className={`cursor-pointer pointer-events-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-lg flex items-center gap-2.5 sm:gap-3 transition-all duration-150 active:scale-95 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105 ${
            isPlayState
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
          }`}
          title="Iniciar / Pausar (Barra de Espaço)"
        >
          {isPlayState ? (
            <>
              <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
              <span>INICIAR</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
              <span>PAUSAR</span>
            </>
          )}
        </button>

        {/* Avançar Próximo Round */}
        <button
          type="button"
          onClick={onSkipNext}
          className="cursor-pointer pointer-events-auto p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105"
          title="Próximo Round / Pular Descanso (N)"
          aria-label="Avançar round"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Resetar Treino */}
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer pointer-events-auto p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:scale-105"
          title="Resetar Treino Completo (R)"
          aria-label="Resetar treino"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Modo Mobile: Barra de Ferramentas Secundárias (Visível apenas em telas pequenas) */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-sm gap-1.5 px-1">
        <button
          type="button"
          onClick={onOpenPresets}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] font-semibold active:scale-95"
          title="Modalidades"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Modalidades</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] font-semibold active:scale-95"
          title="Configurar"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Configurar</span>
        </button>

        <button
          type="button"
          onClick={onAddMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-emerald-400 border border-zinc-800 text-xs font-bold flex items-center gap-0.5 active:scale-95"
          title="+1 Minuto"
        >
          <Plus className="w-3 h-3" />
          <span>1m</span>
        </button>

        <button
          type="button"
          onClick={onSubtractMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-400 border border-zinc-800 text-xs font-bold flex items-center gap-0.5 active:scale-95"
          title="-1 Minuto"
        >
          <Minus className="w-3 h-3" />
          <span>1m</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className={`p-2 rounded-xl border text-xs active:scale-95 ${
            isMuted 
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-400' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}
          title={isMuted ? 'Desmutar' : 'Mutar'}
          aria-label={isMuted ? 'Desmutar' : 'Mutar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs active:scale-95"
          title="Tela Cheia"
          aria-label="Tela cheia"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Desktop / TV: Grupo Direita (+/- 1m, Mute, Tela Cheia) */}
      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
        {/* +1 Minuto */}
        <button
          type="button"
          onClick={onAddMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="cursor-pointer pointer-events-auto px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-emerald-400 border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-bold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title="Adicionar 1 minuto ao rola (+)"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>1m</span>
        </button>

        {/* -1 Minuto */}
        <button
          type="button"
          onClick={onSubtractMinute}
          disabled={phase === 'idle' || phase === 'finished'}
          className="cursor-pointer pointer-events-auto px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-400 border border-zinc-800 transition active:scale-95 text-xs sm:text-sm font-bold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title="Subtrair 1 minuto do rola (-)"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>1m</span>
        </button>

        {/* Mudo / Som */}
        <button
          type="button"
          onClick={onToggleMute}
          className={`cursor-pointer pointer-events-auto p-2.5 sm:p-3 rounded-2xl border transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${
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
          type="button"
          onClick={toggleFullscreen}
          className="cursor-pointer pointer-events-auto p-2.5 sm:p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400"
          title="Modo Tela Cheia para Smart TV / Monitor (F)"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};


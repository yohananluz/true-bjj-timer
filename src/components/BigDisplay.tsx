import React from 'react';
import { TimerPhase } from '../types/timer';
import { formatMinutesSeconds, formatTotalElapsed } from '../utils/timeFormat';
import { Swords, Coffee, AlertTriangle, Hourglass } from 'lucide-react';
import logoUrl from '../assets/true-bjj-logo-white.png';

interface BigDisplayProps {
  phase: TimerPhase;
  timeRemaining: number;
  phaseDuration: number;
  currentRound: number;
  totalRounds: number;
  totalElapsed: number;
  isPaused: boolean;
  onDisplayClick: () => void;
}

export const BigDisplay: React.FC<BigDisplayProps> = ({
  phase,
  timeRemaining,
  phaseDuration,
  currentRound,
  totalRounds,
  totalElapsed,
  isPaused,
  onDisplayClick,
}) => {
  // Configurações visuais por fase
  const getPhaseTheme = () => {
    switch (phase) {
      case 'roll':
        return {
          title: 'ROLA / LUTA',
          subtext: 'Mantenha o ritmo e a guarda ativa',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          glowColor: 'shadow-[0_0_80px_rgba(16,185,129,0.25)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          progressBarColor: 'bg-emerald-500',
          icon: <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 animate-pulse" />,
        };
      case 'warning':
        return {
          title: 'ÚLTIMOS 10 SEGUNDOS!',
          subtext: 'Bateu o clapper! Explosão final!',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/60',
          glowColor: 'shadow-[0_0_120px_rgba(245,158,11,0.4)] animate-pulse-fast',
          badgeBg: 'bg-amber-500/30 text-amber-200 border-amber-500/60',
          progressBarColor: 'bg-amber-400',
          icon: <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-bounce" />,
        };
      case 'rest':
        return {
          title: 'DESCANSO / HIDRATAÇÃO',
          subtext: 'Respire fundo, troque de dupla',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          glowColor: 'shadow-[0_0_80px_rgba(244,63,94,0.25)]',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          progressBarColor: 'bg-rose-500',
          icon: <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />,
        };
      case 'prepare':
        return {
          title: 'PREPARE-SE!',
          subtext: 'Amarre a faixa e cumprimente a dupla',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/40',
          glowColor: 'shadow-[0_0_80px_rgba(249,115,22,0.3)]',
          badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          progressBarColor: 'bg-orange-500',
          icon: <Hourglass className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 animate-spin" />,
        };
      case 'finished':
        return {
          title: 'TREINO FINALIZADO - OSS!',
          subtext: 'True BJJ • Treino concluído com honra e excelência',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/40',
          glowColor: 'shadow-[0_0_100px_rgba(168,85,247,0.3)]',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          progressBarColor: 'bg-purple-500',
          icon: <img src={logoUrl} alt="True BJJ" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow" />,
        };
      default: // idle
        return {
          title: 'TATAME PRONTO',
          subtext: 'True BJJ • Respect • Technique • Unity • Excellence',
          textColor: 'text-zinc-100',
          borderColor: 'border-zinc-800',
          glowColor: 'shadow-none',
          badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          progressBarColor: 'bg-zinc-600',
          icon: <img src={logoUrl} alt="True BJJ" className="w-8 h-8 sm:w-10 sm:h-10 object-contain opacity-90 drop-shadow" />,
        };
    }
  };

  const theme = getPhaseTheme();

  // Cálculo da porcentagem da barra de progresso
  const progressPercent = phaseDuration > 0
    ? Math.max(0, Math.min(100, ((phaseDuration - timeRemaining) / phaseDuration) * 100))
    : 0;

  return (
    <div
      onClick={onDisplayClick}
      className={`relative flex-1 w-full flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 select-none cursor-pointer bg-zinc-950/80 backdrop-blur-md overflow-hidden min-h-0 ${theme.borderColor} ${theme.glowColor}`}
    >
      {/* Barra de Progresso Superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-zinc-900/60 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-linear ${theme.progressBarColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Cabeçalho do Display: Indicador de Rounds e Tempo Total */}
      <div className="w-full flex items-center justify-between z-10 gap-2">
        {/* Badge do Round Atual */}
        <div className={`flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border text-xs sm:text-lg md:text-xl font-bold tracking-wider uppercase ${theme.badgeBg}`}>
          {theme.icon}
          <span>
            {totalRounds > 0 ? (
              <>Round <strong className="text-white text-base sm:text-2xl">{currentRound}</strong> / {totalRounds}</>
            ) : (
              <>Round <strong className="text-white text-base sm:text-2xl">{currentRound}</strong> (Contínuo)</>
            )}
          </span>
        </div>

        {/* Indicador de Pausa ou Tempo Total */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPaused && (
            <span className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[11px] sm:text-sm md:text-base font-bold animate-pulse">
              PAUSADO
            </span>
          )}
          <div className="text-right">
            <span className="text-zinc-500 text-[10px] sm:text-sm uppercase block font-semibold">Tempo Total</span>
            <span className="text-zinc-300 font-mono text-xs sm:text-lg font-bold">{formatTotalElapsed(totalElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Miolo Central: Dígitos Massivos de Tempo */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 w-full min-h-0">
        {/* Título de Fase Grande */}
        <h2 className={`text-base sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 text-center ${theme.textColor}`}>
          {theme.title}
        </h2>
        <p className="text-zinc-400 text-[11px] sm:text-sm md:text-base tracking-wide mb-1 sm:mb-4 text-center line-clamp-1 sm:line-clamp-none">
          {theme.subtext}
        </p>

        {/* Cronômetro com Fonte Gigante para TV e adaptada para celular */}
        <div className={`font-mono font-black tracking-tight leading-none select-none text-center drop-shadow-2xl transition-transform duration-200 ${theme.textColor} text-[19vw] sm:text-[18vw] md:text-[15vw] lg:text-[14vw]`}>
          {formatMinutesSeconds(timeRemaining)}
        </div>
      </div>

      {/* Rodapé Interno do Display: Instrução sutil */}
      <div className="w-full text-center text-zinc-500 text-[11px] sm:text-xs md:text-sm font-medium z-10">
        Toque na tela para {isPaused || phase === 'idle' ? 'Iniciar' : 'Pausar'}
        <span className="hidden sm:inline"> • Pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono border border-zinc-700">Espaço</kbd></span>
      </div>

      {/* Marca d'água oficial True BJJ integrada ao fundo do tatame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={logoUrl}
          alt=""
          className={`w-[65vw] max-w-[420px] max-h-[420px] object-contain transition-all duration-700 ${
            phase === 'finished'
              ? 'opacity-25 scale-110 drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]'
              : phase === 'roll'
              ? 'opacity-[0.06] sm:opacity-[0.08] drop-shadow-[0_0_40px_rgba(16,185,129,0.2)]'
              : phase === 'warning'
              ? 'opacity-[0.10] drop-shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-pulse'
              : 'opacity-[0.05] sm:opacity-[0.07]'
          }`}
        />
      </div>

      {/* Efeito de Gradiente de Fundo no Tatame */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
  );
};


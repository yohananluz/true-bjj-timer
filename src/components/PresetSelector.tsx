import React from 'react';
import { TimerPreset } from '../types/timer';
import { DEFAULT_PRESETS } from '../data/defaultPresets';
import { formatMinutesSeconds } from '../utils/timeFormat';
import { X, Check, Flame, Trophy, Award, Smile, Zap, Infinity } from 'lucide-react';
import logoUrl from '../assets/true-bjj-logo-white.png';

interface PresetSelectorProps {
  isOpen: boolean;
  activePresetId?: string;
  onSelectPreset: (preset: TimerPreset) => void;
  onClose: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  isOpen,
  activePresetId,
  onSelectPreset,
  onClose,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (category: TimerPreset['category']) => {
    switch (category) {
      case 'adulto':
        return <Flame className="w-5 h-5 text-emerald-400" />;
      case 'competicao':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'kids':
        return <Smile className="w-5 h-5 text-blue-400" />;
      case 'drills':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'condicionamento':
        return <Zap className="w-5 h-5 text-rose-400" />;
      default:
        return <Infinity className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header Fixo no Topo */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-zinc-800 flex-shrink-0 bg-zinc-900">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="True BJJ" className="w-8 h-8 object-contain" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Modalidades de Treino (True BJJ)
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Selecione o formato de treino padrão para a sua aula
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition active:scale-95"
            aria-label="Fechar modalidades"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Presets com Scroll Interno */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className={`flex flex-col text-left p-4 rounded-2xl border transition text-sm relative group active:scale-[0.98] ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                      : 'bg-zinc-950/50 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      {getCategoryIcon(preset.category)}
                      <span>{preset.name}</span>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 text-xs mb-3 flex-1">
                    {preset.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-mono font-semibold pt-2 border-t border-zinc-800/60 text-zinc-300">
                    <span className="text-emerald-400">
                      Rola: {formatMinutesSeconds(preset.config.rollTime)}
                    </span>
                    <span>•</span>
                    <span className="text-rose-400">
                      Desc: {formatMinutesSeconds(preset.config.restTime)}
                    </span>
                    <span>•</span>
                    <span className="text-blue-400">
                      {preset.config.rounds > 0 ? `${preset.config.rounds} rounds` : 'Sem limite'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


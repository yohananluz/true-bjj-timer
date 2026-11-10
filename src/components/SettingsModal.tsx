import React, { useState } from 'react';
import { TimerConfig } from '../types/timer';
import { soundService } from '../services/soundService';
import { X, Check, Volume2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  config: TimerConfig;
  onSave: (newConfig: TimerConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  config,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const [rounds, setRounds] = useState<number>(config.rounds);
  const [rollMinutes, setRollMinutes] = useState<number>(Math.floor(config.rollTime / 60));
  const [rollSeconds, setRollSeconds] = useState<number>(config.rollTime % 60);
  const [restMinutes, setRestMinutes] = useState<number>(Math.floor(config.restTime / 60));
  const [restSeconds, setRestSeconds] = useState<number>(config.restTime % 60);
  const [prepareSeconds, setPrepareSeconds] = useState<number>(config.prepareTime);
  const [warningSeconds, setWarningSeconds] = useState<number>(config.warningTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: TimerConfig = {
      rounds: Math.max(0, rounds),
      rollTime: Math.max(5, rollMinutes * 60 + rollSeconds),
      restTime: Math.max(0, restMinutes * 60 + restSeconds),
      prepareTime: Math.max(0, prepareSeconds),
      warningTime: Math.max(0, warningSeconds),
      soundEnabled: true,
    };
    onSave(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white">⚙️ Configurar Cronômetro</h3>
            <p className="text-zinc-400 text-sm">Personalize os tempos exatos para o seu treino</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Rounds */}
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1">
              Quantidade de Rounds (0 = Sem Limite / Contínuo)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
              />
              <span className="text-zinc-400 text-sm whitespace-nowrap">
                {rounds === 0 ? 'Infinito' : `${rounds} rounds`}
              </span>
            </div>
          </div>

          {/* Tempo de Rola (Minutos e Segundos) */}
          <div>
            <label className="block text-emerald-400 text-sm font-semibold mb-1">
              Duração do Rola (Luta)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Minutos</span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={rollMinutes}
                  onChange={(e) => setRollMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Segundos</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={rollSeconds}
                  onChange={(e) => setRollSeconds(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Tempo de Descanso */}
          <div>
            <label className="block text-rose-400 text-sm font-semibold mb-1">
              Duração do Descanso
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Minutos</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={restMinutes}
                  onChange={(e) => setRestMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Segundos</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={restSeconds}
                  onChange={(e) => setRestSeconds(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono text-lg focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Ajustes Finos (Preparação e Alerta 10s) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-orange-400 text-xs font-semibold mb-1">
                Contagem Inicial (Prep)
              </label>
              <select
                value={prepareSeconds}
                onChange={(e) => setPrepareSeconds(parseInt(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
              >
                <option value={0}>Sem preparação</option>
                <option value={3}>3 segundos</option>
                <option value={5}>5 segundos</option>
                <option value={10}>10 segundos</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-400 text-xs font-semibold mb-1">
                Batedor de Madeira (Clapper)
              </label>
              <select
                value={warningSeconds}
                onChange={(e) => setWarningSeconds(parseInt(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value={5}>Últimos 5s</option>
                <option value={10}>Últimos 10s (Padrão)</option>
                <option value={15}>Últimos 15s</option>
                <option value={30}>Últimos 30s</option>
              </select>
            </div>
          </div>

          {/* Teste Rápido de Sons do Tatame */}
          <div className="pt-2 border-t border-zinc-800">
            <label className="block text-zinc-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Testar Alertas Sonoros da TV / Caixa de Som</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => soundService.playStartGong()}
                className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>🔔 Início (Sino + Gongo)</span>
              </button>
              <button
                type="button"
                onClick={() => soundService.playClapper()}
                className="px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>🪵 10s (Clapper)</span>
              </button>
              <button
                type="button"
                onClick={() => soundService.playEndHorn()}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>🚨 Fim (Buzina)</span>
              </button>
              <button
                type="button"
                onClick={() => soundService.playRestEndChime()}
                className="px-3 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 text-blue-300 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>🎵 Fim Descanso</span>
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              Aplicar ao Timer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


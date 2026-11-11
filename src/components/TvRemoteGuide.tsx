import React, { useState } from 'react';
import { Tv, Keyboard, X } from 'lucide-react';

export const TvRemoteGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="hidden md:flex w-full items-center justify-between px-3 sm:px-4 py-1.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-400 text-[11px] sm:text-xs">
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
        <span className="flex items-center gap-1 font-semibold text-zinc-300">
          <Tv className="w-3.5 h-3.5 text-blue-400" />
          <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
          <span>Atalhos (TV & Teclado):</span>
        </span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">OK / Espaço</kbd> Play/Pause</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">Setas ⬅️ ➡️</kbd> Navegar</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">F</kbd> Tela Cheia</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">N</kbd> Próximo Round</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">P</kbd> Voltar Round</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">R</kbd> Reiniciar</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">+</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">-</kbd> +1m / -1m</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono">M</kbd> Mutar</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-2 text-zinc-500 hover:text-zinc-300 transition"
        title="Ocultar atalhos"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};


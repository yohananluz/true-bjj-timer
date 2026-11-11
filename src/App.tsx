import { useState } from 'react';
import { useBjjTimer } from './hooks/useBjjTimer';
import { DEFAULT_PRESETS } from './data/defaultPresets';
import { TimerPreset, TimerConfig } from './types/timer';
import { BigDisplay } from './components/BigDisplay';
import { Controls } from './components/Controls';
import { PresetSelector } from './components/PresetSelector';
import { SettingsModal } from './components/SettingsModal';
import { TvRemoteGuide } from './components/TvRemoteGuide';
import { Eye, Flame } from 'lucide-react';
import logoUrl from './assets/true-bjj-logo-white.png';

const STORAGE_KEY_CONFIG = 'bjj_timer_saved_config';
const STORAGE_KEY_PRESET_ID = 'bjj_timer_active_preset_id';

export function App() {
  // Carregar preset salvo ou usar o primeiro por padrão
  const [activePreset, setActivePreset] = useState<TimerPreset>(() => {
    try {
      const savedPresetId = localStorage.getItem(STORAGE_KEY_PRESET_ID);
      if (savedPresetId) {
        const found = DEFAULT_PRESETS.find(p => p.id === savedPresetId);
        if (found) return found;
      }
    } catch {
      // localStorage indisponível
    }
    return DEFAULT_PRESETS[0];
  });

  // Carregar configuração salva ou do preset ativo
  const initialConfig = (): TimerConfig => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        return JSON.parse(savedConfig);
      }
    } catch {
      // fallback
    }
    return activePreset.config;
  };

  const {
    state,
    config,
    setConfig,
    isMuted,
    wakeLockActive,
    actions,
  } = useBjjTimer(initialConfig());

  // Estados dos modais
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Persistir configurações no LocalStorage
  const handleSelectPreset = (preset: TimerPreset) => {
    setActivePreset(preset);
    setConfig(preset.config);
    actions.reset();
    try {
      localStorage.setItem(STORAGE_KEY_PRESET_ID, preset.id);
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(preset.config));
    } catch {
      // erro silencioso
    }
  };

  const handleSaveCustomConfig = (newConfig: TimerConfig) => {
    setConfig(newConfig);
    actions.reset();
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    } catch {
      // erro silencioso
    }
  };

  return (
    <main className="w-full h-full flex flex-col justify-between p-3 sm:p-5 md:p-6 bg-zinc-950 text-white overflow-hidden box-border">
      {/* Top Bar: Identidade BJJ, Preset Ativo e Status de Wake Lock */}
      <header className="w-full flex items-center justify-between pb-2 sm:pb-3 border-b border-zinc-900 z-20">
        {/* Logo / Marca Oficial True BJJ */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative flex items-center justify-center p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
            <img
              src={logoUrl}
              alt="True BJJ Logo"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black tracking-wider uppercase flex items-center gap-1.5 leading-tight">
              <span className="tracking-widest">TRUE BJJ</span>
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TIMER
              </span>
            </h1>
            <p className="text-[9px] sm:text-[11px] text-zinc-400 font-medium tracking-wider uppercase hidden xs:block">
              Respect • Technique • Unity • Excellence
            </p>
          </div>
        </div>

        {/* Modalidade Ativa (Pill clicável para troca rápida) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs sm:text-sm font-semibold transition text-zinc-200"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[120px] sm:max-w-none truncate">{activePreset.name}</span>
          </button>

          {/* Indicador de Tela Sempre Ativa (Wake Lock) */}
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium border ${
              wakeLockActive 
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
            title={wakeLockActive ? 'Tela configurada para não apagar' : 'Wake Lock inativo'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{wakeLockActive ? 'Tela Ativa' : 'Standby'}</span>
          </div>
        </div>
      </header>

      {/* Área Central: O Grande Display Visível para Smart TV */}
      <section className="flex-1 w-full my-2 sm:my-3 flex flex-col items-center justify-center relative min-h-0">
        <BigDisplay
          phase={state.phase}
          timeRemaining={state.timeRemaining}
          phaseDuration={state.phaseDuration}
          currentRound={state.currentRound}
          totalRounds={state.totalRounds}
          totalElapsed={state.totalElapsed}
          isPaused={state.isPaused}
          onDisplayClick={actions.togglePlayPause}
        />
      </section>

      {/* Controles do Professor / Atleta */}
      <footer className="w-full flex flex-col gap-2 z-30 relative pointer-events-auto">
        <Controls
          phase={state.phase}
          isRunning={state.isRunning}
          isPaused={state.isPaused}
          isMuted={isMuted}
          onTogglePlayPause={actions.togglePlayPause}
          onReset={actions.reset}
          onSkipNext={actions.skipNext}
          onSkipPrevious={actions.skipPrevious}
          onAddMinute={actions.addMinute}
          onSubtractMinute={actions.subtractMinute}
          onToggleMute={actions.toggleMute}
          onOpenPresets={() => setIsPresetModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* Guia de Atalhos para Controle Remoto de TV e Teclado */}
        <TvRemoteGuide />
      </footer>

      {/* Modais */}
      <PresetSelector
        isOpen={isPresetModalOpen}
        activePresetId={activePreset.id}
        onSelectPreset={handleSelectPreset}
        onClose={() => setIsPresetModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        config={config}
        onSave={handleSaveCustomConfig}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </main>
  );
}

export default App;


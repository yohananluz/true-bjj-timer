/**
 * Serviço de Gerenciamento da Screen Wake Lock API.
 * Impede que a tela de Smart TVs, Celulares e Notebooks durma ou apague durante os treinos.
 */

interface WakeLockSentinel {
  released: boolean;
  release(): Promise<void>;
  addEventListener(type: 'release', listener: () => void): void;
}

class WakeLockService {
  private sentinel: WakeLockSentinel | null = null;
  private isRequested: boolean = false;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isRequested) {
          this.requestLock();
        }
      });
    }
  }

  public async requestLock(): Promise<boolean> {
    this.isRequested = true;
    try {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && navigator.wakeLock) {
        // Timeout de proteção para Smart TVs (LG webOS / Tizen) onde request('screen') pode travar
        const lockPromise = (navigator.wakeLock as { request: (type: string) => Promise<WakeLockSentinel> }).request('screen');
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('WakeLock timeout')), 800)
        );

        this.sentinel = await Promise.race([lockPromise, timeoutPromise]);
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
        });
        return true;
      }
    } catch (err) {
      console.warn('Wake Lock não suportado ou bloqueado pelo dispositivo:', err);
    }
    return false;
  }

  public async releaseLock(): Promise<void> {
    this.isRequested = false;
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch (err) {
        console.warn('Erro ao liberar Wake Lock:', err);
      } finally {
        this.sentinel = null;
      }
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public isActive(): boolean {
    return this.sentinel !== null && !this.sentinel.released;
  }
}

export const wakeLockService = new WakeLockService();


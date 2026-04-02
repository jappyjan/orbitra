// Web-only AuthContext: no biometric support, no expo-local-authentication.
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import * as keyManager from './keyManager';
import { usePersonStore } from '@/stores/usePersonStore';

type AuthStatus = 'loading' | 'needs-setup' | 'locked' | 'unlocked';

interface AuthContextValue {
  status: AuthStatus;
  setup: (passphrase: string) => Promise<void>;
  unlockWithPassphrase: (passphrase: string) => Promise<void>;
  unlockWithBiometric: () => Promise<void>;
  lock: () => void;
  biometricAvailable: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    (async () => {
      const hasSetup = await keyManager.isSetup();
      if (!hasSetup) {
        setStatus('needs-setup');
        return;
      }

      const key = await keyManager.unlockWithStoredKey();
      if (key) {
        await usePersonStore.persist.rehydrate();
        setStatus('unlocked');
      } else {
        setStatus('locked');
      }
    })();
  }, []);

  const setup = useCallback(async (passphrase: string) => {
    await keyManager.setup(passphrase);
    await usePersonStore.persist.rehydrate();
    setStatus('unlocked');
  }, []);

  const unlockWithPassphrase = useCallback(async (passphrase: string) => {
    await keyManager.unlockWithPassphrase(passphrase);
    await usePersonStore.persist.rehydrate();
    setStatus('unlocked');
  }, []);

  const unlockWithBiometric = useCallback(async () => {
    throw new Error('Biometric not available on web');
  }, []);

  const lock = useCallback(() => {
    keyManager.lock();
    setStatus('locked');
  }, []);

  return (
    <AuthContext.Provider
      value={{ status, setup, unlockWithPassphrase, unlockWithBiometric, lock, biometricAvailable: false }}
    >
      {children}
    </AuthContext.Provider>
  );
}

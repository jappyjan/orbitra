import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Platform } from 'react-native';
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
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check initial state on mount
  useEffect(() => {
    (async () => {
      // Check biometric availability (native only)
      if (Platform.OS !== 'web') {
        try {
          const LocalAuth = await import('expo-local-authentication');
          const compatible = await LocalAuth.hasHardwareAsync();
          const enrolled = compatible && (await LocalAuth.isEnrolledAsync());
          setBiometricAvailable(enrolled);
        } catch {
          setBiometricAvailable(false);
        }
      }

      const hasSetup = await keyManager.isSetup();
      if (!hasSetup) {
        setStatus('needs-setup');
        return;
      }

      // Try auto-unlock with stored key
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
    if (Platform.OS === 'web') throw new Error('Biometric not available on web');

    const LocalAuth = await import('expo-local-authentication');
    const result = await LocalAuth.authenticateAsync({
      promptMessage: 'Unlock Orbitra',
      fallbackLabel: 'Use Passphrase',
      disableDeviceFallback: true,
    });

    if (!result.success) {
      throw new Error('Biometric authentication failed');
    }

    const key = await keyManager.unlockWithStoredKey();
    if (!key) throw new Error('No stored key found. Please enter your passphrase.');

    await usePersonStore.persist.rehydrate();
    setStatus('unlocked');
  }, []);

  const lock = useCallback(() => {
    keyManager.lock();
    setStatus('locked');
  }, []);

  return (
    <AuthContext.Provider
      value={{ status, setup, unlockWithPassphrase, unlockWithBiometric, lock, biometricAvailable }}
    >
      {children}
    </AuthContext.Provider>
  );
}

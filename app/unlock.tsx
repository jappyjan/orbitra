import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/lib/AuthContext';

const MIN_PASSPHRASE_LENGTH = 8;

export default function UnlockScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { status, setup, unlockWithPassphrase, unlockWithBiometric, biometricAvailable } = useAuth();

  const isSetupMode = status === 'needs-setup';

  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async () => {
    if (passphrase.length < MIN_PASSPHRASE_LENGTH) {
      setError(`Passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters`);
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await setup(passphrase);
    } catch {
      setError('Failed to set up encryption. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!passphrase.trim()) {
      setError('Please enter your passphrase');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await unlockWithPassphrase(passphrase);
    } catch {
      setError('Could not decrypt data. Wrong passphrase?');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    setLoading(true);
    setError('');
    try {
      await unlockWithBiometric();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Biometric authentication failed';
      if (msg.includes('No stored key')) {
        setError('Please enter your passphrase to unlock.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <FontAwesome name="lock" size={56} color={colors.tint} />
        <Text style={styles.title}>
          {isSetupMode ? 'Set Up Encryption' : 'Unlock Orbitra'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isSetupMode
            ? 'Choose a passphrase to encrypt your data. This key only you hold.'
            : 'Enter your passphrase to decrypt your data.'}
        </Text>

        <View style={styles.form} lightColor="transparent" darkColor="transparent">
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.cardBorder,
              },
            ]}
            placeholder={isSetupMode ? 'Choose a passphrase' : 'Enter passphrase'}
            placeholderTextColor={colors.placeholder}
            value={passphrase}
            onChangeText={(text) => { setPassphrase(text); setError(''); }}
            secureTextEntry
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />

          {isSetupMode && (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                  borderColor: colors.cardBorder,
                },
              ]}
              placeholder="Confirm passphrase"
              placeholderTextColor={colors.placeholder}
              value={confirmPassphrase}
              onChangeText={(text) => { setConfirmPassphrase(text); setError(''); }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.tint, opacity: loading ? 0.6 : pressed ? 0.8 : 1 },
            ]}
            onPress={isSetupMode ? handleSetup : handleUnlock}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText} lightColor="#fff" darkColor="#000">
              {loading ? 'Please wait...' : isSetupMode ? 'Set Up & Continue' : 'Unlock'}
            </Text>
          </Pressable>

          {!isSetupMode && biometricAvailable && (
            <Pressable
              style={({ pressed }) => [
                styles.biometricButton,
                { borderColor: colors.tint, opacity: loading ? 0.6 : pressed ? 0.8 : 1 },
              ]}
              onPress={handleBiometric}
              disabled={loading}
            >
              <FontAwesome name="key" size={16} color={colors.tint} />
              <Text style={[styles.biometricText, { color: colors.tint }]}>
                Use Biometrics
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    width: '100%',
    maxWidth: 340,
    marginTop: 24,
    gap: 12,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  biometricButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

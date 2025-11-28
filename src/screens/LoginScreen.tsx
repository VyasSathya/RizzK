/**
 * LoginScreen - Login screen
 * Connected to Supabase auth
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from '../shims/reanimated';
import { GradientBackground, Button, Card, Input, Logo } from '../components/common';
import { colors, spacing, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onBack,
}) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      HapticService.error();
      return;
    }

    HapticService.medium();

    try {
      await signIn({ email, password });
      HapticService.success();
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      HapticService.error();
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.duration(600)}>
              <Card variant="elevated" style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                  <Logo size="medium" animated={false} />
                  <Text style={styles.subtitle}>Welcome Back</Text>
                </View>

                {/* Form */}
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />

                {/* Error Message */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Buttons */}
                <Button
                  title={loading ? "Logging in..." : "Log In"}
                  onPress={handleLogin}
                  variant="primary"
                  disabled={loading}
                  haptic="medium"
                />
                <Button
                  title="Back"
                  onPress={onBack}
                  variant="secondary"
                  style={styles.backButton}
                  disabled={loading}
                />
              </Card>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  card: {
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 10,
    fontSize: 15,
  },
  backButton: {
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

export default LoginScreen;






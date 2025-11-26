/**
 * LoginScreen - Login screen
 * Matches the HTML prototype login screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground, Button, Card, Input, Logo } from '../components/common';
import { colors, spacing } from '../theme';
import { HapticService } from '../services/haptics';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    HapticService.medium();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      onLogin(email, password);
    }, 1000);
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
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

                {/* Buttons */}
                <Button
                  title="Log In"
                  onPress={handleLogin}
                  variant="primary"
                  loading={loading}
                  haptic="medium"
                />
                <Button
                  title="Back"
                  onPress={onBack}
                  variant="secondary"
                  style={styles.backButton}
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
});

export default LoginScreen;


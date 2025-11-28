/**
 * SignUpScreen - Create account screen
 * Connected to Supabase auth
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from '../shims/reanimated';
import { GradientBackground, Button, Card, Input, Logo } from '../components/common';
import { colors, spacing, borderRadius, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { useAuth } from '../contexts/AuthContext';

interface SignUpScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: 'male' | 'female' | 'non-binary' | 'other' | '';
}

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onContinue,
  onBack,
}) => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
  });
  const [error, setError] = useState('');

  const handleGenderSelect = (gender: FormData['gender']) => {
    HapticService.light();
    setFormData({ ...formData, gender });
  };

  const handleContinue = async () => {
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.age || !formData.gender) {
      setError('Please fill in all fields');
      HapticService.error();
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      HapticService.error();
      return;
    }

    HapticService.medium();

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        age: parseInt(formData.age, 10),
        gender: formData.gender as 'male' | 'female' | 'non-binary' | 'other',
      });
      HapticService.success();
      onContinue();
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      HapticService.error();
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)}>
            <Card variant="elevated" style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <Logo size="medium" animated={false} />
                <Text style={styles.subtitle}>Create Your Account</Text>
              </View>

              {/* Form */}
              <Input
                label="Name"
                placeholder="Your name"
                value={formData.name}
                onChangeText={(name) => setFormData({ ...formData, name })}
                autoCapitalize="words"
              />

              <Input
                label="Email"
                placeholder="your@email.com"
                value={formData.email}
                onChangeText={(email) => setFormData({ ...formData, email })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(password) => setFormData({ ...formData, password })}
                secureTextEntry
              />

              <Input
                label="Age"
                placeholder="25"
                value={formData.age}
                onChangeText={(age) => setFormData({ ...formData, age })}
                keyboardType="number-pad"
              />

              {/* Gender Selection */}
              <View style={styles.genderContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderOptions}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      style={[
                        styles.genderOption,
                        formData.gender === g.value && styles.genderSelected,
                      ]}
                      onPress={() => handleGenderSelect(g.value)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === g.value && styles.genderTextSelected,
                        ]}
                      >
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Error Message */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Buttons */}
              <Button
                title={loading ? "Creating Account..." : "Continue"}
                onPress={handleContinue}
                variant="primary"
                haptic="medium"
                disabled={loading}
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
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  card: { paddingVertical: 30 },
  header: { alignItems: 'center', marginBottom: 30 },
  subtitle: { color: colors.textSecondary, marginTop: 10, fontSize: 15 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm, opacity: 0.9 },
  genderContainer: { marginBottom: spacing.xl },
  genderOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genderOption: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: borderRadius.md, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder },
  genderSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.15)' },
  genderText: { color: colors.text, fontSize: 14 },
  genderTextSelected: { color: colors.primary, fontWeight: '600' },
  backButton: { marginTop: spacing.md },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: spacing.md },
});

export default SignUpScreen;






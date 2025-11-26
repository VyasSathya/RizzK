/**
 * SignUpScreen - Create account screen
 * Matches the HTML prototype signup screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientBackground, Button, Card, Input, Logo } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

interface SignUpScreenProps {
  onContinue: (data: SignUpData) => void;
  onBack: () => void;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
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
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
  });

  const handleGenderSelect = (gender: string) => {
    HapticService.light();
    setFormData({ ...formData, gender });
  };

  const handleContinue = () => {
    HapticService.medium();
    onContinue(formData);
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
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

              {/* Buttons */}
              <Button
                title="Continue"
                onPress={handleContinue}
                variant="primary"
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
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  card: { paddingVertical: 30 },
  header: { alignItems: 'center', marginBottom: 30 },
  subtitle: { color: colors.textSecondary, marginTop: 10, fontSize: 15 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm, opacity: 0.9 },
  genderContainer: { marginBottom: spacing.xl },
  genderOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genderOption: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: borderRadius.md, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder },
  genderSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.2)' },
  genderText: { color: colors.text, fontSize: 14 },
  genderTextSelected: { color: colors.primary, fontWeight: '600' },
  backButton: { marginTop: spacing.md },
});

export default SignUpScreen;


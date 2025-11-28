/**
 * DareOrDrinkScreen - Dare or Drink game
 * Players choose to do a dare or take a drink
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card, Avatar, Icon } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';

interface DareOrDrinkScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const DARES = [
  "Do your best impression of someone in the group",
  "Share your most embarrassing dating story",
  "Let someone go through your camera roll for 30 seconds",
  "Send a flirty text to your crush (or last match)",
  "Do 10 push-ups right now",
  "Speak in an accent for the next 2 rounds",
  "Let the group post something on your Instagram story",
  "Call your mom and tell her you're on a date",
  "Show your screen time report",
  "Reveal your most-played song this week",
];

const PLAYERS = [
  { name: 'You', gender: 'male' as const },
  { name: 'Maya', gender: 'female' as const },
  { name: 'Alex', gender: 'male' as const },
  { name: 'Sam', gender: 'male' as const },
  { name: 'Jordan', gender: 'female' as const },
  { name: 'Taylor', gender: 'male' as const },
];

export const DareOrDrinkScreen: React.FC<DareOrDrinkScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [choice, setChoice] = useState<'dare' | 'drink' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const totalRounds = 5;

  const currentDare = DARES[(currentRound - 1 + currentPlayerIndex) % DARES.length];
  const currentPlayer = PLAYERS[currentPlayerIndex];

  const handleChoice = (selected: 'dare' | 'drink') => {
    HapticService.medium();
    setChoice(selected);
    setShowResult(true);
  };

  const handleNext = () => {
    HapticService.light();
    if (currentPlayerIndex < PLAYERS.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setChoice(null);
      setShowResult(false);
    } else if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setCurrentPlayerIndex(0);
      setChoice(null);
      setShowResult(false);
    } else {
      HapticService.success();
      onComplete();
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader
            title="Dare or Drink"
            icon="activity"
            currentRound={currentRound}
            totalRounds={totalRounds}
            showTimer={false}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <View style={styles.avatarGlow}>
              <Avatar name={currentPlayer.name} size={80} gender={currentPlayer.gender} />
            </View>
            <Text style={styles.playerName}>{currentPlayer.name}'s Turn</Text>
            <Text style={styles.playerSubtitle}>Choose wisely...</Text>
          </Animated.View>

          {/* Dare Card */}
          <Animated.View key={currentRound + '-' + currentPlayerIndex} entering={SlideInRight.duration(400)}>
            <LinearGradient
              colors={['rgba(255, 20, 147, 0.15)', 'rgba(255, 20, 147, 0.05)']}
              style={styles.dareCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.dareIconContainer}>
                <Icon name="zap" size={24} color={colors.primary} />
              </View>
              <Text style={styles.dareLabel}>THE DARE</Text>
              <Text style={styles.dareText}>{currentDare}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Choice Buttons */}
          {!showResult && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.choiceButtons}>
              <Button title="Do the Dare" onPress={() => handleChoice('dare')} variant="primary" style={styles.choiceButton} />
              <Button title="Take a Drink" onPress={() => handleChoice('drink')} variant="secondary" style={styles.choiceButton} />
            </Animated.View>
          )}

          {/* Result */}
          {showResult && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultContainer}>
              <View style={styles.resultIconContainer}>
                <Icon name={choice === 'dare' ? 'zap' : 'coffee'} size={40} color={colors.primary} />
              </View>
              <Text style={styles.resultText}>
                {choice === 'dare' ? 'Doing the dare!' : 'Taking a drink!'}
              </Text>
              <Button title="Next Player" onPress={handleNext} variant="primary" haptic="light" />
            </Animated.View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Back to Games" onPress={onBack} variant="secondary" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  playerSection: { alignItems: 'center', marginBottom: spacing.lg },
  avatarGlow: { 
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 20,
    elevation: 10,
  },
  playerName: { fontSize: 26, fontFamily: fonts.headingBold, color: colors.text, marginTop: spacing.md, letterSpacing: 1 },
  playerSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 5 },
  dareCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 20, 147, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  dareLabel: { fontSize: 12, color: colors.primary, fontWeight: '700', letterSpacing: 3, marginBottom: spacing.md },
  dareText: { fontSize: 20, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 32 },
  choiceButtons: { gap: spacing.md, marginBottom: spacing.lg },
  choiceButton: { width: '100%' },
  resultContainer: { alignItems: 'center', gap: spacing.lg },
  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: { fontSize: 24, fontWeight: '700', color: colors.primary, letterSpacing: 1 },
  buttonContainer: { paddingTop: spacing.xl },
});

export default DareOrDrinkScreen;



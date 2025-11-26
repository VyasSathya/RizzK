/**
 * DareOrDrinkScreen - Dare or Drink game
 * Players choose to do a dare or take a drink
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { GradientBackground, Button, Card, Avatar } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing } from '../../theme';
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
  { name: 'You' },
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
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <GameHeader
            title="Dare or Drink"
            icon="activity"
            currentRound={currentRound}
            totalRounds={totalRounds}
            showTimer={false}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <Avatar name={currentPlayer.name} size={60} gender={currentPlayer.gender} />
            <Text style={styles.playerName}>{currentPlayer.name}'s Turn</Text>
          </Animated.View>

          {/* Dare Card */}
          <Animated.View key={\\-\\} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.dareCard}>
              <Text style={styles.dareLabel}>THE DARE</Text>
              <Text style={styles.dareText}>{currentDare}</Text>
            </Card>
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
              <Text style={styles.resultText}>
                {choice === 'dare' ? 'Doing the dare!' : 'Taking a drink!'}
              </Text>
              <Button title="Next Player" onPress={handleNext} variant="primary" haptic="light" />
            </Animated.View>
          )}

          <Button title="Back to Games" onPress={onBack} variant="secondary" style={styles.backButton} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40 },
  playerSection: { alignItems: 'center', marginBottom: 20 },
  playerName: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 10 },
  dareCard: { paddingVertical: 40, alignItems: 'center', marginBottom: 25 },
  dareLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', letterSpacing: 2, marginBottom: 15 },
  dareText: { fontSize: 20, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 30 },
  choiceButtons: { gap: 15, marginBottom: 25 },
  choiceButton: { width: '100%' },
  resultContainer: { alignItems: 'center', gap: 20 },
  resultText: { fontSize: 24, fontWeight: '700', color: colors.primary },
  backButton: { marginTop: 'auto' },
});

export default DareOrDrinkScreen;

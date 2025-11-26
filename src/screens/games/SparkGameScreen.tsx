/**
 * SparkGameScreen - Deep conversation questions
 * Players take turns answering thought-provoking questions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInRight, SlideOutLeft } from '../../shims/reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface SparkGameScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  "What's something you've never told anyone on a first date?",
  "If you could relive one day of your life, which would it be?",
  "What's your biggest fear about falling in love?",
  "What's the most spontaneous thing you've ever done?",
  "What do you think people misunderstand about you?",
  "What's a deal-breaker for you in a relationship?",
  "What's the best advice you've ever received about love?",
  "If you could have dinner with anyone, dead or alive, who would it be?",
  "What's something you're secretly proud of?",
  "What does your ideal Sunday look like?",
];

const PLAYERS = [
  { name: 'You', avatar: '😊' },
  { name: 'Maya', avatar: '👩' },
  { name: 'Alex', avatar: '👨' },
  { name: 'Sam', avatar: '🧔' },
  { name: 'Jordan', avatar: '👱‍♀️' },
  { name: 'Taylor', avatar: '👨‍🦱' },
];

export const SparkGameScreen: React.FC<SparkGameScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const totalRounds = 5;

  const currentQuestion = QUESTIONS[(currentRound - 1) % QUESTIONS.length];
  const currentPlayer = PLAYERS[currentPlayerIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextPlayer();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayerIndex]);

  const handleNextPlayer = () => {
    HapticService.light();
    if (currentPlayerIndex < PLAYERS.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setTimeLeft(60);
    } else {
      handleNextRound();
    }
  };

  const handleNextRound = () => {
    HapticService.medium();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setCurrentPlayerIndex(0);
      setTimeLeft(60);
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
            title="Spark"
            icon="⚡"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <Text style={styles.playerLabel}>Now answering:</Text>
            <View style={styles.playerInfo}>
              <Text style={styles.playerAvatar}>{currentPlayer.avatar}</Text>
              <Text style={styles.playerName}>{currentPlayer.name}</Text>
            </View>
          </Animated.View>

          {/* Question Card */}
          <Animated.View key={currentQuestion} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.questionCard}>
              <Text style={styles.questionLabel}>Question</Text>
              <Text style={styles.question}>{currentQuestion}</Text>
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={currentPlayerIndex < PLAYERS.length - 1 ? 'Next Person' : 'Next Round'}
              onPress={currentPlayerIndex < PLAYERS.length - 1 ? handleNextPlayer : handleNextRound}
              variant="primary"
              haptic="medium"
            />
            <Button
              title="Back to Games"
              onPress={onBack}
              variant="secondary"
              style={styles.backButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40 },
  playerSection: { alignItems: 'center', marginBottom: 25 },
  playerLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerAvatar: { fontSize: 40 },
  playerName: { fontSize: 24, fontWeight: '700', color: colors.text },
  questionCard: { paddingVertical: 40, alignItems: 'center' },
  questionLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', letterSpacing: 2, marginBottom: 15 },
  question: { fontSize: 22, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 32 },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});

export default SparkGameScreen;




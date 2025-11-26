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
import Animated, { FadeIn, SlideInRight } from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card, Avatar, Icon } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius, shadows } from '../../theme';
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
  { name: 'You', gender: 'male' as const },
  { name: 'Maya', gender: 'female' as const },
  { name: 'Alex', gender: 'male' as const },
  { name: 'Sam', gender: 'male' as const },
  { name: 'Jordan', gender: 'female' as const },
  { name: 'Taylor', gender: 'male' as const },
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
            icon="zap"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <Text style={styles.playerLabel}>NOW ANSWERING</Text>
            <View style={styles.playerInfo}>
              <View style={styles.avatarGlow}>
                <Avatar name={currentPlayer.name} size={60} gender={currentPlayer.gender} />
              </View>
              <Text style={styles.playerName}>{currentPlayer.name}</Text>
            </View>
          </Animated.View>

          {/* Question Card */}
          <Animated.View key={currentQuestion} entering={SlideInRight.duration(400)}>
            <LinearGradient
              colors={['rgba(255, 20, 147, 0.15)', 'rgba(255, 20, 147, 0.05)']}
              style={styles.questionCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.questionIconContainer}>
                <Icon name="zap" size={24} color={colors.primary} />
              </View>
              <Text style={styles.questionLabel}>QUESTION</Text>
              <Text style={styles.question}>{currentQuestion}</Text>
            </LinearGradient>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title={currentPlayerIndex < PLAYERS.length - 1 ? 'Next Person' : 'Next Round'}
              onPress={currentPlayerIndex < PLAYERS.length - 1 ? handleNextPlayer : handleNextRound}
              variant="primary"
              size="large"
              haptic="medium"
            />
            <Button
              title="Back to Games"
              onPress={onBack}
              variant="secondary"
              size="large"
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
  playerSection: { alignItems: 'center', marginBottom: 30 },
  playerLabel: { 
    fontSize: 12, 
    color: colors.textTertiary, 
    letterSpacing: 3,
    marginBottom: 15,
  },
  playerInfo: { alignItems: 'center', gap: 12 },
  avatarGlow: { ...shadows.glowIntense },
  playerName: { fontSize: 26, fontWeight: '700', color: colors.text, letterSpacing: 1 },
  questionCard: { 
    paddingVertical: 40, 
    paddingHorizontal: 25,
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  questionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  questionLabel: { 
    fontSize: 12, 
    color: colors.primary, 
    fontWeight: '700', 
    letterSpacing: 3, 
    marginBottom: 15,
  },
  question: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: colors.text, 
    textAlign: 'center', 
    lineHeight: 34,
  },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.xl },
  backButton: { marginTop: spacing.lg },
});

export default SparkGameScreen;

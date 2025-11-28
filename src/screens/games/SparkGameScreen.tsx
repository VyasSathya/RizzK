/**
 * SparkGameScreen - Deep conversation questions
 * With multiplayer support
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight } from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card, Avatar, Icon } from '../../components/common';
import { GameHeader, GameIntro, PlayerTurnTransition, RoundTransition, GameResults } from '../../components/games';
import { colors, spacing, borderRadius, shadows, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';
import { useGameSession } from '../../hooks/useGameSession';

interface SparkGameScreenProps {
  eventId?: string;
  players?: { id: string; name: string; gender: 'male' | 'female' }[];
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

const MOCK_PLAYERS = [
  { id: '0', name: 'You', gender: 'male' as const },
  { id: '1', name: 'Maya', gender: 'female' as const },
  { id: '2', name: 'Alex', gender: 'male' as const },
  { id: '3', name: 'Sam', gender: 'male' as const },
  { id: '4', name: 'Jordan', gender: 'female' as const },
  { id: '5', name: 'Taylor', gender: 'male' as const },
];

export const SparkGameScreen: React.FC<SparkGameScreenProps> = ({
  eventId,
  players: propPlayers,
  onComplete,
  onBack,
}) => {
  const gameSession = eventId ? useGameSession({ eventId, gameType: 'spark' }) : null;

  const activePlayers = useMemo(() => {
    if (gameSession?.players && gameSession.players.length > 0) {
      return gameSession.players.map(p => ({
        id: p.user_id,
        name: p.profile?.first_name || 'Player',
        gender: (p.profile?.gender as 'male' | 'female') || 'male',
      }));
    }
    return propPlayers || MOCK_PLAYERS;
  }, [gameSession?.players, propPlayers]);

  const [phase, setPhase] = useState<'intro' | 'playing' | 'playerTurn' | 'transition' | 'results'>('intro');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chipsEarned, setChipsEarned] = useState(0);
  const totalRounds = 5;

  const currentQuestion = QUESTIONS[(currentRound - 1) % QUESTIONS.length];
  const currentPlayer = activePlayers[currentPlayerIndex] || activePlayers[0];

  useEffect(() => {
    if (phase !== 'playing') return;
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
  }, [phase, currentPlayerIndex]);

  const handleNextPlayer = () => {
    HapticService.light();
    setScore(s => s + 10);
    setChipsEarned(c => c + 2);
    if (currentPlayerIndex < activePlayers.length - 1) {
      setPhase('playerTurn');
    } else {
      handleNextRound();
    }
  };

  const startNextPlayer = () => {
    setCurrentPlayerIndex(currentPlayerIndex + 1);
    setTimeLeft(60);
    setPhase('playing');
  };

  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setPhase('transition');
    } else {
      setPhase('results');
    }
  };

  const startNextRound = () => {
    setCurrentRound(currentRound + 1);
    setCurrentPlayerIndex(0);
    setTimeLeft(60);
    setPhase('playing');
  };

  // Results screen
  if (phase === 'results') {
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Spark"
            gameIcon="zap"
            score={score}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Rounds Played', value: totalRounds },
              { label: 'Questions Answered', value: totalRounds * PLAYERS.length },
            ]}
            onContinue={onComplete}
            onPlayAgain={() => {
              setPhase('intro');
              setCurrentRound(1);
              setCurrentPlayerIndex(0);
              setScore(0);
              setChipsEarned(0);
            }}
          />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />

      <GameIntro
        visible={phase === 'intro'}
        gameName="Spark"
        gameIcon="zap"
        description="Deep conversations that spark real connections. Take turns answering thought-provoking questions."
        rules={['Listen to each answer', 'Be genuine & curious', 'Build on the conversation']}
        onComplete={() => setPhase('playing')}
      />

      <PlayerTurnTransition
        visible={phase === 'playerTurn'}
        playerName={PLAYERS[(currentPlayerIndex + 1) % PLAYERS.length].name}
        onComplete={startNextPlayer}
      />

      <RoundTransition
        visible={phase === 'transition'}
        currentRound={currentRound + 1}
        totalRounds={totalRounds}
        message="New question coming up!"
        onComplete={startNextRound}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader
            title="Spark"
            icon="zap"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={phase === 'playing'}
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
              title={currentPlayerIndex < PLAYERS.length - 1 ? '✓ Done - Next Person' : '✓ Done - Next Round'}
              onPress={handleNextPlayer}
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
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  playerSection: { alignItems: 'center', marginBottom: spacing.xl },
  playerLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  playerInfo: { alignItems: 'center', gap: spacing.sm },
  avatarGlow: { ...shadows.glowIntense },
  playerName: { fontSize: 26, fontFamily: fonts.headingBold, color: colors.text, letterSpacing: 1 },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 20, 147, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  questionLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  question: { 
    fontSize: 22, 
    fontWeight: '600', 
    color: colors.text, 
    textAlign: 'center', 
    lineHeight: 34,
  },
  buttonContainer: { paddingTop: spacing.xl },
  backButton: { marginTop: spacing.lg },
});

export default SparkGameScreen;



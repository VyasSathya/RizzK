/**
 * DareOrDrinkScreen - Dare or Drink game
 * With multiplayer support
 */

import React, { useState, useMemo } from 'react';
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
import { GameHeader, GameIntro, PlayerTurnTransition, RoundTransition, GameResults } from '../../components/games';
import { colors, spacing, borderRadius, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';
import { useGameSession } from '../../hooks/useGameSession';

interface DareOrDrinkScreenProps {
  eventId?: string;
  players?: { id: string; name: string; gender: 'male' | 'female' }[];
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

const MOCK_PLAYERS = [
  { id: '0', name: 'You', gender: 'male' as const },
  { id: '1', name: 'Maya', gender: 'female' as const },
  { id: '2', name: 'Alex', gender: 'male' as const },
  { id: '3', name: 'Sam', gender: 'male' as const },
  { id: '4', name: 'Jordan', gender: 'female' as const },
  { id: '5', name: 'Taylor', gender: 'male' as const },
];

export const DareOrDrinkScreen: React.FC<DareOrDrinkScreenProps> = ({
  eventId,
  players: propPlayers,
  onComplete,
  onBack,
}) => {
  const gameSession = eventId ? useGameSession({ eventId, gameType: 'dare_or_drink' }) : null;

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
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [choice, setChoice] = useState<'dare' | 'drink' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [chipsEarned, setChipsEarned] = useState(0);
  const [daresCompleted, setDaresCompleted] = useState(0);
  const [drinksTaken, setDrinksTaken] = useState(0);
  const totalRounds = 5;

  const currentDare = DARES[(currentRound - 1 + currentPlayerIndex) % DARES.length];
  const currentPlayer = activePlayers[currentPlayerIndex] || activePlayers[0];

  const handleChoice = (selected: 'dare' | 'drink') => {
    HapticService.medium();
    setChoice(selected);
    setShowResult(true);
    if (selected === 'dare') {
      setDaresCompleted(d => d + 1);
      setScore(s => s + 20);
      setChipsEarned(c => c + 5);
    } else {
      setDrinksTaken(d => d + 1);
      setScore(s => s + 5);
      setChipsEarned(c => c + 1);
    }
  };

  const handleNext = () => {
    HapticService.light();
    if (currentPlayerIndex < activePlayers.length - 1) {
      setPhase('playerTurn');
    } else if (currentRound < totalRounds) {
      setPhase('transition');
    } else {
      setPhase('results');
    }
  };

  const startNextPlayer = () => {
    setCurrentPlayerIndex(currentPlayerIndex + 1);
    setChoice(null);
    setShowResult(false);
    setPhase('playing');
  };

  const startNextRound = () => {
    setCurrentRound(currentRound + 1);
    setCurrentPlayerIndex(0);
    setChoice(null);
    setShowResult(false);
    setPhase('playing');
  };

  // Results screen
  if (phase === 'results') {
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Dare or Drink"
            gameIcon="activity"
            score={score}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Dares Completed', value: daresCompleted },
              { label: 'Drinks Taken', value: drinksTaken },
            ]}
            onContinue={onComplete}
            onPlayAgain={() => {
              setPhase('intro');
              setCurrentRound(1);
              setCurrentPlayerIndex(0);
              setScore(0);
              setChipsEarned(0);
              setDaresCompleted(0);
              setDrinksTaken(0);
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
        gameName="Dare or Drink"
        gameIcon="activity"
        description="Face the dare or take a drink! No chickening out - you must choose one."
        rules={['Read the dare', 'Do it or drink', 'No backing out!']}
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
        message="New round of dares!"
        onComplete={startNextRound}
      />

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
          {phase === 'playing' && !showResult && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.choiceButtons}>
              <Button title="🔥 Do the Dare" onPress={() => handleChoice('dare')} variant="primary" style={styles.choiceButton} />
              <Button title="🍺 Take a Drink" onPress={() => handleChoice('drink')} variant="secondary" style={styles.choiceButton} />
            </Animated.View>
          )}

          {/* Result */}
          {showResult && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultContainer}>
              <View style={styles.resultIconContainer}>
                <Icon name={choice === 'dare' ? 'zap' : 'coffee'} size={40} color={colors.primary} />
              </View>
              <Text style={styles.resultText}>
                {choice === 'dare' ? '🔥 Doing the dare! +5 chips' : '🍺 Taking a drink! +1 chip'}
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



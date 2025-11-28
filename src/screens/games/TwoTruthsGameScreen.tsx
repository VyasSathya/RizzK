/**
 * TwoTruthsGameScreen - Two Truths and a Lie
 * Enhanced with full UX flow: intro → play → wait → reveal → results
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { GradientBackground, Button, Card, Avatar } from '../../components/common';
import {
  GameHeader,
  GameIntro,
  WaitingOverlay,
  RoundTransition,
  GameResults
} from '../../components/games';
import { colors, spacing, borderRadius, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';

interface TwoTruthsGameScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const ROUNDS = [
  { player: 'Maya', gender: 'female' as const, statements: ['I\'ve been skydiving twice', 'I can speak 3 languages', 'I\'ve never broken a bone'], lie: 1 },
  { player: 'Alex', gender: 'male' as const, statements: ['I\'ve met a celebrity', 'I can juggle', 'I\'ve never been on a plane'], lie: 2 },
  { player: 'Sam', gender: 'male' as const, statements: ['I have a twin sibling', 'I\'ve climbed a mountain', 'I can play piano'], lie: 0 },
  { player: 'Jordan', gender: 'female' as const, statements: ['I\'ve lived in 5 countries', 'I\'m afraid of heights', 'I can cook 50 recipes'], lie: 2 },
  { player: 'Taylor', gender: 'male' as const, statements: ['I\'ve won a contest', 'I can do a backflip', 'I\'ve never had coffee'], lie: 1 },
];

export const TwoTruthsGameScreen: React.FC<TwoTruthsGameScreenProps> = ({
  onComplete,
  onBack,
}) => {
  // Game phases
  const [phase, setPhase] = useState<'intro' | 'playing' | 'waiting' | 'reveal' | 'transition' | 'results'>('intro');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [chipsEarned, setChipsEarned] = useState(0);
  const totalRounds = ROUNDS.length;

  const currentData = ROUNDS[(currentRound - 1) % ROUNDS.length];

  // Timer for playing phase
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleReveal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, currentRound]);

  const handleSelect = (index: number) => {
    if (phase !== 'playing') return;
    HapticService.light();
    setSelectedIndex(index);
  };

  const handleReveal = () => {
    HapticService.medium();
    setPhase('waiting');

    // Simulate waiting for others (1.5-3s)
    setTimeout(() => {
      const correct = selectedIndex === currentData.lie;
      if (correct) {
        setScore(s => s + 100);
        setChipsEarned(c => c + 10);
        HapticService.success();
      } else {
        HapticService.error();
      }
      setPhase('reveal');
    }, 1500 + Math.random() * 1500);
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
    setSelectedIndex(null);
    setTimeLeft(30);
    setPhase('playing');
  };

  const getStatementStyle = (index: number) => {
    if (phase === 'playing' || phase === 'waiting') {
      return selectedIndex === index ? styles.statementSelected : styles.statement;
    }
    if (index === currentData.lie) {
      return styles.statementLie;
    }
    return styles.statementTruth;
  };

  // Show results screen
  if (phase === 'results') {
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Two Truths & a Lie"
            gameIcon="eye"
            score={score}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Rounds Played', value: totalRounds },
              { label: 'Correct Guesses', value: Math.floor(score / 100) },
            ]}
            onContinue={onComplete}
            onPlayAgain={() => {
              setPhase('intro');
              setCurrentRound(1);
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

      {/* Game Intro */}
      <GameIntro
        visible={phase === 'intro'}
        gameName="Two Truths & a Lie"
        gameIcon="eye"
        description="Can you spot the lie? Each player shares 3 statements - your job is to guess which one is false!"
        rules={['One statement is a lie', 'Pick which you think is false', 'Faster = more points']}
        onComplete={() => setPhase('playing')}
      />

      {/* Waiting Overlay */}
      <WaitingOverlay
        visible={phase === 'waiting'}
        message="Waiting for others..."
        players={ROUNDS.map(r => ({ id: r.player, name: r.player, gender: r.gender }))}
      />

      {/* Round Transition */}
      <RoundTransition
        visible={phase === 'transition'}
        currentRound={currentRound + 1}
        totalRounds={totalRounds}
        message={`${ROUNDS[currentRound % ROUNDS.length].player}'s turn next!`}
        onComplete={startNextRound}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader
            title="Two Truths & a Lie"
            icon="eye"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={phase === 'playing'}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <Avatar name={currentData.player} size={60} gender={currentData.gender} />
            <Text style={styles.playerName}>{currentData.player}'s Turn</Text>
            <Text style={styles.instruction}>Spot the lie!</Text>
          </Animated.View>

          {/* Statements */}
          <Animated.View key={currentRound} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.statementsCard}>
              {currentData.statements.map((statement, index) => (
                <TouchableOpacity
                  key={index}
                  style={getStatementStyle(index)}
                  onPress={() => handleSelect(index)}
                  activeOpacity={0.7}
                  disabled={phase !== 'playing'}
                >
                  <Text style={styles.statementNumber}>{index + 1}</Text>
                  <Text style={styles.statementText}>{statement}</Text>
                  {phase === 'reveal' && index === currentData.lie && (
                    <Text style={styles.lieLabel}>LIE!</Text>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>

          {/* Result */}
          {phase === 'reveal' && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultContainer}>
              <Text style={selectedIndex === currentData.lie ? styles.resultCorrect : styles.resultWrong}>
                {selectedIndex === currentData.lie ? '🎉 You got it! +10 chips' : '❌ Wrong guess!'}
              </Text>
            </Animated.View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {phase === 'playing' && (
              <Button title="Lock In Guess" onPress={handleReveal} variant="primary" disabled={selectedIndex === null} haptic="medium" />
            )}
            {phase === 'reveal' && (
              <Button title={currentRound < totalRounds ? 'Next Round' : 'See Results'} onPress={handleNextRound} variant="primary" haptic="medium" />
            )}
            <Button title="Back to Games" onPress={onBack} variant="secondary" style={styles.backButton} />
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
  playerName: { fontSize: 22, fontFamily: fonts.headingBold, color: colors.text, marginTop: 10 },
  instruction: { fontSize: 14, color: colors.textSecondary, marginTop: 5 },
  statementsCard: { paddingVertical: spacing.lg, gap: spacing.sm },
  statement: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.md, gap: 12 },
  statementSelected: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: 'rgba(255, 20, 147, 0.15)', borderWidth: 1, borderColor: colors.primary, borderRadius: borderRadius.md, gap: 12 },
  statementLie: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: 'rgba(255, 59, 48, 0.15)', borderWidth: 1, borderColor: colors.error, borderRadius: borderRadius.md, gap: 12 },
  statementTruth: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: 'rgba(52, 199, 89, 0.15)', borderWidth: 1, borderColor: colors.success, borderRadius: borderRadius.md, gap: 12 },
  statementNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, textAlign: 'center', lineHeight: 30, color: '#fff', fontWeight: '700' },
  statementText: { flex: 1, fontSize: 15, color: colors.text },
  lieLabel: { fontSize: 12, fontWeight: '700', color: colors.error },
  resultContainer: { alignItems: 'center', marginTop: spacing.md },
  resultCorrect: { fontSize: 20, fontWeight: '700', color: colors.success },
  resultWrong: { fontSize: 20, fontWeight: '700', color: colors.error },
  buttonContainer: { paddingTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});

export default TwoTruthsGameScreen;



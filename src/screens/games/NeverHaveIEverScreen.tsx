/**
 * NeverHaveIEverScreen - Never Have I Ever game
 * Enhanced with full UX flow
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { GradientBackground, Button, Card, Avatar } from '../../components/common';
import { GameHeader, GameIntro, WaitingOverlay, RoundTransition, GameResults } from '../../components/games';
import { colors, spacing, borderRadius, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';

interface NeverHaveIEverScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const PROMPTS = [
  "Never have I ever... ghosted someone",
  "Never have I ever... had a one night stand",
  "Never have I ever... stalked an ex on social media",
  "Never have I ever... lied on a dating profile",
  "Never have I ever... been in love at first sight",
  "Never have I ever... sent a risky text to the wrong person",
  "Never have I ever... dated someone my friends didn't like",
  "Never have I ever... cried during a breakup movie",
];

const PLAYERS = [
  { name: 'Maya', gender: 'female' as const },
  { name: 'Alex', gender: 'male' as const },
  { name: 'Sam', gender: 'male' as const },
  { name: 'Jordan', gender: 'female' as const },
  { name: 'Taylor', gender: 'male' as const },
];

export const NeverHaveIEverScreen: React.FC<NeverHaveIEverScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'waiting' | 'reveal' | 'transition' | 'results'>('intro');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [myAnswer, setMyAnswer] = useState<boolean | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [chipsEarned, setChipsEarned] = useState(0);
  const totalRounds = 5;

  const currentPrompt = PROMPTS[(currentRound - 1) % PROMPTS.length];

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

  const handleAnswer = (answer: boolean) => {
    if (phase !== 'playing') return;
    HapticService.light();
    setMyAnswer(answer);
  };

  const handleReveal = () => {
    if (myAnswer === null) return;
    HapticService.medium();
    setPhase('waiting');

    setTimeout(() => {
      const answers: Record<string, boolean> = {};
      PLAYERS.forEach(p => {
        answers[p.name] = Math.random() > 0.5;
      });
      setPlayerAnswers(answers);
      setScore(s => s + 20);
      setChipsEarned(c => c + 5);
      setPhase('reveal');
    }, 1500 + Math.random() * 1000);
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
    setMyAnswer(null);
    setPlayerAnswers({});
    setTimeLeft(15);
    setPhase('playing');
  };

  const guiltyCount = Object.values(playerAnswers).filter(v => v).length + (myAnswer ? 1 : 0);

  // Results screen
  if (phase === 'results') {
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Never Have I Ever"
            gameIcon="heart"
            score={score}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Rounds Played', value: totalRounds },
              { label: 'Confessions Made', value: Math.floor(score / 20) },
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

      <GameIntro
        visible={phase === 'intro'}
        gameName="Never Have I Ever"
        gameIcon="heart"
        description="Confess your secrets! Drink if you've done it, or bluff your way through."
        rules={['Read the prompt', 'Answer honestly (or lie!)', 'See who else is guilty']}
        onComplete={() => setPhase('playing')}
      />

      <WaitingOverlay
        visible={phase === 'waiting'}
        message="Collecting confessions..."
        players={PLAYERS.map(p => ({ id: p.name, ...p }))}
      />

      <RoundTransition
        visible={phase === 'transition'}
        currentRound={currentRound + 1}
        totalRounds={totalRounds}
        onComplete={startNextRound}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader
            title="Never Have I Ever"
            icon="heart"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={phase === 'playing'}
          />

          {/* Prompt */}
          <Animated.View key={currentPrompt} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.promptCard}>
              <Text style={styles.prompt}>{currentPrompt}</Text>
            </Card>
          </Animated.View>

          {/* Answer Buttons */}
          {phase === 'playing' && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.answerButtons}>
              <Button
                title="🙋 I Have"
                onPress={() => handleAnswer(true)}
                variant={myAnswer === true ? 'primary' : 'secondary'}
                style={styles.answerButton}
              />
              <Button
                title="😇 Never"
                onPress={() => handleAnswer(false)}
                variant={myAnswer === false ? 'primary' : 'secondary'}
                style={styles.answerButton}
              />
            </Animated.View>
          )}

          {/* Results */}
          {phase === 'reveal' && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Card variant="subtle" style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>
                  {guiltyCount} {guiltyCount === 1 ? 'person' : 'people'} guilty! 👀
                </Text>
                <View style={styles.playerResults}>
                  <View style={styles.resultRow}>
                    <Avatar name="You" size={30} />
                    <Text style={styles.resultName}>You</Text>
                    <Text style={myAnswer ? styles.guilty : styles.innocent}>
                      {myAnswer ? '😈 Guilty' : '😇 Innocent'}
                    </Text>
                  </View>
                  {PLAYERS.map((player) => (
                    <View key={player.name} style={styles.resultRow}>
                      <Avatar name={player.name} size={30} gender={player.gender} />
                      <Text style={styles.resultName}>{player.name}</Text>
                      <Text style={playerAnswers[player.name] ? styles.guilty : styles.innocent}>
                        {playerAnswers[player.name] ? '😈 Guilty' : '😇 Innocent'}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {phase === 'playing' && (
              <Button title="Lock In Answer" onPress={handleReveal} variant="primary" disabled={myAnswer === null} haptic="medium" />
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
  promptCard: { paddingVertical: spacing.xxl, alignItems: 'center', marginBottom: spacing.lg },
  prompt: { fontSize: 22, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 32 },
  answerButtons: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  answerButton: { flex: 1 },
  resultsCard: { paddingVertical: spacing.lg },
  resultsTitle: { fontSize: 20, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: spacing.lg },
  playerResults: { gap: spacing.sm },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  resultName: { flex: 1, fontSize: 16, color: colors.text },
  guilty: { fontSize: 14, color: colors.primary },
  innocent: { fontSize: 14, color: colors.success },
  buttonContainer: { paddingTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});

export default NeverHaveIEverScreen;



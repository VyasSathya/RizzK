/**
 * NeverHaveIEverScreen - Never Have I Ever game
 * Players reveal if they've done something
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, { FadeIn, SlideInRight, FadeInDown } from 'react-native-reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius } from '../../theme';
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
  { name: 'Maya', avatar: '👩' },
  { name: 'Alex', avatar: '👨' },
  { name: 'Sam', avatar: '🧔' },
  { name: 'Jordan', avatar: '👱‍♀️' },
  { name: 'Taylor', avatar: '👨‍🦱' },
];

export const NeverHaveIEverScreen: React.FC<NeverHaveIEverScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [myAnswer, setMyAnswer] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState<Record<string, boolean>>({});
  const totalRounds = 5;

  const currentPrompt = PROMPTS[(currentRound - 1) % PROMPTS.length];

  useEffect(() => {
    if (revealed) return;
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
  }, [revealed, currentRound]);

  const handleAnswer = (answer: boolean) => {
    if (revealed) return;
    HapticService.light();
    setMyAnswer(answer);
  };

  const handleReveal = () => {
    HapticService.medium();
    // Simulate other players' answers
    const answers: Record<string, boolean> = {};
    PLAYERS.forEach(p => {
      answers[p.name] = Math.random() > 0.5;
    });
    setPlayerAnswers(answers);
    setRevealed(true);
  };

  const handleNextRound = () => {
    HapticService.medium();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setMyAnswer(null);
      setRevealed(false);
      setPlayerAnswers({});
      setTimeLeft(15);
    } else {
      HapticService.success();
      onComplete();
    }
  };

  const guiltyCount = Object.values(playerAnswers).filter(v => v).length + (myAnswer ? 1 : 0);

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <GameHeader
            title="Never Have I Ever"
            icon="🙈"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={!revealed}
          />

          {/* Prompt */}
          <Animated.View key={currentPrompt} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.promptCard}>
              <Text style={styles.prompt}>{currentPrompt}</Text>
            </Card>
          </Animated.View>

          {/* Answer Buttons */}
          {!revealed && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.answerButtons}>
              <Button
                title="I Have 😏"
                onPress={() => handleAnswer(true)}
                variant={myAnswer === true ? 'primary' : 'secondary'}
                style={styles.answerButton}
              />
              <Button
                title="Never 😇"
                onPress={() => handleAnswer(false)}
                variant={myAnswer === false ? 'primary' : 'secondary'}
                style={styles.answerButton}
              />
            </Animated.View>
          )}

          {/* Results */}
          {revealed && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <Card variant="subtle" style={styles.resultsCard}>
                <Text style={styles.resultsTitle}>
                  {guiltyCount} {guiltyCount === 1 ? 'person' : 'people'} guilty! 😏
                </Text>
                <View style={styles.playerResults}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultAvatar}>😊</Text>
                    <Text style={styles.resultName}>You</Text>
                    <Text style={myAnswer ? styles.guilty : styles.innocent}>
                      {myAnswer ? '😏 Guilty' : '😇 Innocent'}
                    </Text>
                  </View>
                  {PLAYERS.map((player) => (
                    <View key={player.name} style={styles.resultRow}>
                      <Text style={styles.resultAvatar}>{player.avatar}</Text>
                      <Text style={styles.resultName}>{player.name}</Text>
                      <Text style={playerAnswers[player.name] ? styles.guilty : styles.innocent}>
                        {playerAnswers[player.name] ? '😏 Guilty' : '😇 Innocent'}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!revealed ? (
              <Button title="Reveal Answers" onPress={handleReveal} variant="primary" disabled={myAnswer === null} haptic="medium" />
            ) : (
              <Button title={currentRound < totalRounds ? 'Next Round' : 'Finish Game'} onPress={handleNextRound} variant="primary" haptic="medium" />
            )}
            <Button title="Back to Games" onPress={onBack} variant="secondary" style={styles.backButton} />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40 },
  promptCard: { paddingVertical: 40, alignItems: 'center', marginBottom: 25 },
  prompt: { fontSize: 22, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 32 },
  answerButtons: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  answerButton: { flex: 1 },
  resultsCard: { paddingVertical: 20 },
  resultsTitle: { fontSize: 20, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 20 },
  playerResults: { gap: 12 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultAvatar: { fontSize: 24 },
  resultName: { flex: 1, fontSize: 16, color: colors.text },
  guilty: { fontSize: 14, color: colors.primary },
  innocent: { fontSize: 14, color: colors.success },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.md },
  backButton: { marginTop: spacing.md },
});

export default NeverHaveIEverScreen;


/**
 * TwoTruthsGameScreen - Two Truths and a Lie
 * Players guess which statement is the lie
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, SlideInRight, FadeInDown } from 'react-native-reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface TwoTruthsGameScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const ROUNDS = [
  { player: 'Maya', avatar: '👩', statements: ['I\'ve been skydiving twice', 'I can speak 3 languages', 'I\'ve never broken a bone'], lie: 1 },
  { player: 'Alex', avatar: '👨', statements: ['I\'ve met a celebrity', 'I can juggle', 'I\'ve never been on a plane'], lie: 2 },
  { player: 'Sam', avatar: '🧔', statements: ['I have a twin sibling', 'I\'ve climbed a mountain', 'I can play piano'], lie: 0 },
  { player: 'Jordan', avatar: '👱‍♀️', statements: ['I\'ve lived in 5 countries', 'I\'m afraid of heights', 'I can cook 50 recipes'], lie: 2 },
  { player: 'Taylor', avatar: '👨‍🦱', statements: ['I\'ve won a contest', 'I can do a backflip', 'I\'ve never had coffee'], lie: 1 },
];

export const TwoTruthsGameScreen: React.FC<TwoTruthsGameScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const totalRounds = ROUNDS.length;

  const currentData = ROUNDS[(currentRound - 1) % ROUNDS.length];

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
  }, [revealed]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    HapticService.light();
    setSelectedIndex(index);
  };

  const handleReveal = () => {
    HapticService.medium();
    setRevealed(true);
    if (selectedIndex === currentData.lie) {
      HapticService.success();
    } else {
      HapticService.error();
    }
  };

  const handleNextRound = () => {
    HapticService.medium();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setSelectedIndex(null);
      setRevealed(false);
      setTimeLeft(30);
    } else {
      HapticService.success();
      onComplete();
    }
  };

  const getStatementStyle = (index: number) => {
    if (!revealed) {
      return selectedIndex === index ? styles.statementSelected : styles.statement;
    }
    if (index === currentData.lie) {
      return styles.statementLie;
    }
    return styles.statementTruth;
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <GameHeader
            title="Two Truths & a Lie"
            icon="🎭"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={!revealed}
          />

          {/* Current Player */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.playerSection}>
            <Text style={styles.playerAvatar}>{currentData.avatar}</Text>
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
                  disabled={revealed}
                >
                  <Text style={styles.statementNumber}>{index + 1}</Text>
                  <Text style={styles.statementText}>{statement}</Text>
                  {revealed && index === currentData.lie && (
                    <Text style={styles.lieLabel}>LIE!</Text>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>

          {/* Result */}
          {revealed && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultContainer}>
              <Text style={selectedIndex === currentData.lie ? styles.resultCorrect : styles.resultWrong}>
                {selectedIndex === currentData.lie ? '🎉 You got it!' : '❌ Wrong guess!'}
              </Text>
            </Animated.View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!revealed ? (
              <Button title="Lock In Guess" onPress={handleReveal} variant="primary" disabled={selectedIndex === null} haptic="medium" />
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
  playerSection: { alignItems: 'center', marginBottom: 20 },
  playerAvatar: { fontSize: 50, marginBottom: 10 },
  playerName: { fontSize: 22, fontWeight: '700', color: colors.text },
  instruction: { fontSize: 14, color: colors.textSecondary, marginTop: 5 },
  statementsCard: { paddingVertical: 20, gap: 12 },
  statement: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: colors.glassBg, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: borderRadius.md, gap: 12 },
  statementSelected: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'rgba(255, 20, 147, 0.2)', borderWidth: 2, borderColor: colors.primary, borderRadius: borderRadius.md, gap: 12 },
  statementLie: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'rgba(255, 59, 48, 0.2)', borderWidth: 2, borderColor: colors.error, borderRadius: borderRadius.md, gap: 12 },
  statementTruth: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'rgba(52, 199, 89, 0.2)', borderWidth: 2, borderColor: colors.success, borderRadius: borderRadius.md, gap: 12 },
  statementNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, textAlign: 'center', lineHeight: 30, color: '#fff', fontWeight: '700' },
  statementText: { flex: 1, fontSize: 15, color: colors.text },
  lieLabel: { fontSize: 12, fontWeight: '700', color: colors.error },
  resultContainer: { alignItems: 'center', marginTop: 15 },
  resultCorrect: { fontSize: 20, fontWeight: '700', color: colors.success },
  resultWrong: { fontSize: 20, fontWeight: '700', color: colors.error },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.md },
  backButton: { marginTop: spacing.md },
});

export default TwoTruthsGameScreen;


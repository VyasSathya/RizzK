/**
 * WhoSaidItScreen - Guess who said the quote
 * Players guess which player said a statement
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader, PlayerVoteCard } from '../../components/games';
import { colors, spacing } from '../../theme';
import { HapticService } from '../../services/haptics';

interface WhoSaidItScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const QUOTES = [
  { quote: "I once stayed up for 48 hours binge-watching a show", saidBy: 'Maya' },
  { quote: "I've been on 50+ first dates this year", saidBy: 'Alex' },
  { quote: "I still sleep with a stuffed animal", saidBy: 'Sam' },
  { quote: "I've never been in a relationship longer than 3 months", saidBy: 'Jordan' },
  { quote: "I believe in love at first sight", saidBy: 'Taylor' },
];

const PLAYERS = [
  { id: '1', name: 'Maya', avatar: '👩', gender: 'female' as const },
  { id: '2', name: 'Alex', avatar: '👨', gender: 'male' as const },
  { id: '3', name: 'Sam', avatar: '🧔', gender: 'male' as const },
  { id: '4', name: 'Jordan', avatar: '👱‍♀️', gender: 'female' as const },
  { id: '5', name: 'Taylor', avatar: '👨‍🦱', gender: 'male' as const },
];

export const WhoSaidItScreen: React.FC<WhoSaidItScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const totalRounds = QUOTES.length;

  const currentQuote = QUOTES[(currentRound - 1) % QUOTES.length];
  const correctPlayer = PLAYERS.find(p => p.name === currentQuote.saidBy);

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

  const handlePlayerSelect = (playerId: string) => {
    if (revealed) return;
    HapticService.light();
    setSelectedPlayer(playerId);
  };

  const handleReveal = () => {
    HapticService.medium();
    setRevealed(true);
    const selectedName = PLAYERS.find(p => p.id === selectedPlayer)?.name;
    if (selectedName === currentQuote.saidBy) {
      HapticService.success();
      setScore(score + 1);
    } else {
      HapticService.error();
    }
  };

  const handleNext = () => {
    HapticService.light();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setSelectedPlayer(null);
      setRevealed(false);
      setTimeLeft(20);
    } else {
      HapticService.success();
      onComplete();
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <GameHeader title="Who Said It?" icon="💬" currentRound={currentRound} totalRounds={totalRounds} timeLeft={timeLeft} showTimer={!revealed} />

          {/* Score */}
          <Text style={styles.score}>Score: {score}/{currentRound - (revealed ? 0 : 1)}</Text>

          {/* Quote Card */}
          <Animated.View key={currentRound} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.quoteCard}>
              <Text style={styles.quoteLabel}>WHO SAID...</Text>
              <Text style={styles.quote}>"{currentQuote.quote}"</Text>
            </Card>
          </Animated.View>

          {/* Players Grid */}
          <View style={styles.playersGrid}>
            {PLAYERS.map((player) => (
              <PlayerVoteCard
                key={player.id}
                name={player.name}
                avatar={player.avatar}
                gender={player.gender}
                isSelected={selectedPlayer === player.id || (revealed && player.name === currentQuote.saidBy)}
                onPress={() => handlePlayerSelect(player.id)}
                disabled={revealed}
              />
            ))}
          </View>

          {/* Result */}
          {revealed && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultContainer}>
              <Text style={PLAYERS.find(p => p.id === selectedPlayer)?.name === currentQuote.saidBy ? styles.resultCorrect : styles.resultWrong}>
                {PLAYERS.find(p => p.id === selectedPlayer)?.name === currentQuote.saidBy ? '🎉 Correct!' : `❌ It was ${currentQuote.saidBy}!`}
              </Text>
            </Animated.View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!revealed ? (
              <Button title="Lock In Guess" onPress={handleReveal} variant="primary" disabled={!selectedPlayer} haptic="medium" />
            ) : (
              <Button title={currentRound < totalRounds ? 'Next Quote' : 'See Results'} onPress={handleNext} variant="primary" haptic="medium" />
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
  content: { padding: spacing.xl, paddingTop: 40 },
  score: { textAlign: 'center', fontSize: 16, color: colors.primary, fontWeight: '600', marginBottom: 15 },
  quoteCard: { paddingVertical: 30, alignItems: 'center', marginBottom: 20 },
  quoteLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', letterSpacing: 2, marginBottom: 15 },
  quote: { fontSize: 20, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 30, fontStyle: 'italic' },
  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 20 },
  resultContainer: { alignItems: 'center', marginBottom: 15 },
  resultCorrect: { fontSize: 22, fontWeight: '700', color: colors.success },
  resultWrong: { fontSize: 22, fontWeight: '700', color: colors.error },
  buttonContainer: { paddingTop: spacing.md },
  backButton: { marginTop: spacing.md },
});

export default WhoSaidItScreen;




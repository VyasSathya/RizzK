/**
 * HotTakeGameScreen - "Most Likely To" voting game
 * Players vote on who is most likely to do something
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
import Animated, { FadeIn, SlideInRight } from '../../shims/reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader, PlayerVoteCard } from '../../components/games';
import { colors, spacing } from '../../theme';
import { HapticService } from '../../services/haptics';

interface HotTakeGameScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const PROMPTS = [
  "Most likely to become famous",
  "Most likely to survive a zombie apocalypse",
  "Most likely to text their ex at 2am",
  "Most likely to win a reality TV show",
  "Most likely to become a millionaire",
  "Most likely to get lost in their own city",
  "Most likely to cry during a movie",
  "Most likely to start a viral trend",
];

const PLAYERS = [
  { id: '1', name: 'Maya', avatar: '👩', gender: 'female' as const },
  { id: '2', name: 'Alex', avatar: '👨', gender: 'male' as const },
  { id: '3', name: 'Sam', avatar: '🧔', gender: 'male' as const },
  { id: '4', name: 'Jordan', avatar: '👱‍♀️', gender: 'female' as const },
  { id: '5', name: 'Taylor', avatar: '👨‍🦱', gender: 'male' as const },
];

export const HotTakeGameScreen: React.FC<HotTakeGameScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const totalRounds = 5;

  const currentPrompt = PROMPTS[(currentRound - 1) % PROMPTS.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!hasVoted) handleVoteSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasVoted]);

  const handlePlayerSelect = (playerId: string) => {
    if (hasVoted) return;
    setSelectedPlayer(playerId);
  };

  const handleVoteSubmit = () => {
    if (!selectedPlayer) return;
    HapticService.medium();
    
    // Simulate other players voting
    const newVotes: Record<string, number> = {};
    PLAYERS.forEach(p => {
      newVotes[p.id] = Math.floor(Math.random() * 3);
    });
    newVotes[selectedPlayer] = (newVotes[selectedPlayer] || 0) + 1;
    
    setVotes(newVotes);
    setHasVoted(true);
  };

  const handleNextRound = () => {
    HapticService.medium();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setSelectedPlayer(null);
      setHasVoted(false);
      setVotes({});
      setTimeLeft(30);
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
          <GameHeader
            title="Hot Take"
            icon="🔥"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={!hasVoted}
          />

          {/* Prompt */}
          <Animated.View key={currentPrompt} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.promptCard}>
              <Text style={styles.promptLabel}>WHO IS...</Text>
              <Text style={styles.prompt}>{currentPrompt}?</Text>
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
                isSelected={selectedPlayer === player.id}
                voteCount={votes[player.id] || 0}
                showVotes={hasVoted}
                onPress={() => handlePlayerSelect(player.id)}
                disabled={hasVoted}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!hasVoted ? (
              <Button
                title="Submit Vote"
                onPress={handleVoteSubmit}
                variant="primary"
                disabled={!selectedPlayer}
                haptic="medium"
              />
            ) : (
              <Button
                title={currentRound < totalRounds ? 'Next Round' : 'Finish Game'}
                onPress={handleNextRound}
                variant="primary"
                haptic="medium"
              />
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
  promptCard: { paddingVertical: 30, alignItems: 'center', marginBottom: 25 },
  promptLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', letterSpacing: 2, marginBottom: 10 },
  prompt: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center' },
  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 25 },
  buttonContainer: { paddingTop: spacing.md },
  backButton: { marginTop: spacing.md },
});

export default HotTakeGameScreen;




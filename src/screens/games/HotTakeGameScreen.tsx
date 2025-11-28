/**
 * HotTakeGameScreen - "Most Likely To" voting game
 * Now with real multiplayer support!
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
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { GradientBackground, Button, Card } from '../../components/common';
import {
  GameHeader,
  PlayerVoteCard,
  GameIntro,
  WaitingOverlay,
  RoundTransition,
  GameResults
} from '../../components/games';
import { colors, spacing, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';
import { useGameSession } from '../../hooks/useGameSession';
import { GamePlayer } from '../../services/gameSession';

interface HotTakeGameScreenProps {
  eventId?: string;
  players?: { id: string; name: string; gender: 'male' | 'female' }[];
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

// Fallback mock players when not connected to event
const MOCK_PLAYERS = [
  { id: '1', name: 'Maya', gender: 'female' as const },
  { id: '2', name: 'Alex', gender: 'male' as const },
  { id: '3', name: 'Sam', gender: 'male' as const },
  { id: '4', name: 'Jordan', gender: 'female' as const },
  { id: '5', name: 'Taylor', gender: 'male' as const },
];

export const HotTakeGameScreen: React.FC<HotTakeGameScreenProps> = ({
  eventId,
  players: propPlayers,
  onComplete,
  onBack,
}) => {
  // Use multiplayer hook if eventId provided
  const gameSession = eventId ? useGameSession({ eventId, gameType: 'hot_take' }) : null;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'waiting' | 'reveal' | 'transition' | 'results'>('intro');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [chipsEarned, setChipsEarned] = useState(0);
  const totalRounds = 5;

  // Use real players from session, prop players, or fallback to mock
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

  const currentPrompt = PROMPTS[(currentRound - 1) % PROMPTS.length];

  // Count votes from real-time actions
  useEffect(() => {
    if (!gameSession?.actions) return;
    const roundVotes: Record<string, number> = {};
    gameSession.actions.forEach(action => {
      if (action.round === currentRound && action.action_type === 'vote') {
        const votedFor = action.action_data.votedFor;
        roundVotes[votedFor] = (roundVotes[votedFor] || 0) + 1;
      }
    });
    if (Object.keys(roundVotes).length > 0) {
      setVotes(roundVotes);
    }
  }, [gameSession?.actions, currentRound]);

  // Check if all players voted (for real multiplayer)
  useEffect(() => {
    if (!gameSession || phase !== 'waiting') return;
    const votesThisRound = gameSession.actions.filter(
      a => a.round === currentRound && a.action_type === 'vote'
    ).length;
    if (votesThisRound >= activePlayers.length) {
      // Everyone voted - reveal!
      const maxVotes = Math.max(...Object.values(votes), 0);
      if (votes[selectedPlayer!] === maxVotes) {
        setScore(s => s + 50);
        setChipsEarned(c => c + 5);
        gameSession.addScore(50, 5);
        HapticService.success();
      }
      setPhase('reveal');
    }
  }, [gameSession?.actions, phase, activePlayers.length, currentRound, votes, selectedPlayer]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (selectedPlayer) handleVoteSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, selectedPlayer]);

  const handlePlayerSelect = (playerId: string) => {
    if (phase !== 'playing') return;
    HapticService.light();
    setSelectedPlayer(playerId);
  };

  const handleVoteSubmit = async () => {
    if (!selectedPlayer) return;
    HapticService.medium();
    setPhase('waiting');

    // Submit vote to real-time session
    if (gameSession) {
      await gameSession.submitAnswer('vote', { votedFor: selectedPlayer, prompt: currentPrompt });
    }

    // For non-multiplayer or as fallback, simulate other votes after delay
    if (!gameSession || activePlayers.length <= 1) {
      setTimeout(() => {
        const newVotes: Record<string, number> = {};
        activePlayers.forEach(p => {
          newVotes[p.id] = Math.floor(Math.random() * 3);
        });
        newVotes[selectedPlayer] = (newVotes[selectedPlayer] || 0) + 1;
        setVotes(newVotes);

        const maxVotes = Math.max(...Object.values(newVotes));
        if (newVotes[selectedPlayer] === maxVotes) {
          setScore(s => s + 50);
          setChipsEarned(c => c + 5);
          HapticService.success();
        }
        setPhase('reveal');
      }, 1500 + Math.random() * 1500);
    }
  };

  const handleNextRound = async () => {
    if (currentRound < totalRounds) {
      setPhase('transition');
      if (gameSession?.isHost) {
        await gameSession.nextRound();
      }
    } else {
      setPhase('results');
      if (gameSession) {
        await gameSession.finish();
      }
    }
  };

  const startNextRound = () => {
    setCurrentRound(currentRound + 1);
    setSelectedPlayer(null);
    setVotes({});
    setTimeLeft(30);
    setPhase('playing');
  };

  // Results screen
  if (phase === 'results') {
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Hot Take"
            gameIcon="award"
            score={score}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Rounds Played', value: totalRounds },
              { label: 'Correct Predictions', value: Math.floor(score / 50) },
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
        gameName="Hot Take"
        gameIcon="award"
        description="Vote on who's most likely to do something! See if your vote matches the group."
        rules={['Read the prompt', 'Vote for a player', 'See who the group chose']}
        onComplete={() => setPhase('playing')}
      />

      <WaitingOverlay
        visible={phase === 'waiting'}
        message="Tallying votes..."
        players={activePlayers.map(p => ({ ...p, ready: Math.random() > 0.3 }))}
      />

      <RoundTransition
        visible={phase === 'transition'}
        currentRound={currentRound + 1}
        totalRounds={totalRounds}
        onComplete={startNextRound}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <GameHeader
            title="Hot Take"
            icon="award"
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            showTimer={phase === 'playing'}
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
            {activePlayers.map((player) => (
              <PlayerVoteCard
                key={player.id}
                name={player.name}
                gender={player.gender}
                isSelected={selectedPlayer === player.id}
                voteCount={votes[player.id] || 0}
                showVotes={phase === 'reveal'}
                onPress={() => handlePlayerSelect(player.id)}
                disabled={phase !== 'playing'}
              />
            ))}
          </View>

          {/* Result message */}
          {phase === 'reveal' && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultMessage}>
              <Text style={styles.resultText}>
                {votes[selectedPlayer!] === Math.max(...Object.values(votes))
                  ? '🎉 You voted with the group! +5 chips'
                  : 'The group disagreed!'}
              </Text>
            </Animated.View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {phase === 'playing' && (
              <Button title="Submit Vote" onPress={handleVoteSubmit} variant="primary" disabled={!selectedPlayer} haptic="medium" />
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
  content: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  promptCard: { paddingVertical: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  promptLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', letterSpacing: 2, marginBottom: 10 },
  prompt: { fontSize: 24, fontFamily: fonts.headingBold, color: colors.text, textAlign: 'center' },
  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg, paddingHorizontal: spacing.xs },
  resultMessage: { alignItems: 'center', marginBottom: spacing.lg },
  resultText: { fontSize: 18, color: colors.primary, fontWeight: '600', textAlign: 'center' },
  buttonContainer: { paddingTop: spacing.lg },
  backButton: { marginTop: spacing.md },
});

export default HotTakeGameScreen;



/**
 * BattleOfSexesScreen - Team trivia battle
 * With real multiplayer teams based on gender!
 */

import React, { useState, useEffect, useMemo } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader, GameIntro, WaitingOverlay, RoundTransition, GameResults } from '../../components/games';
import { colors, spacing, borderRadius, fonts } from '../../theme';
import { HapticService } from '../../services/haptics';
import { useGameSession } from '../../hooks/useGameSession';
import { useAuth } from '../../contexts/AuthContext';

interface BattleOfSexesScreenProps {
  eventId?: string;
  onComplete: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  { q: "What's the average number of shoes a woman owns?", options: ['12', '19', '27', '35'], answer: 2, forTeam: 'men' },
  { q: "What percentage of men cry at movies?", options: ['15%', '35%', '55%', '75%'], answer: 1, forTeam: 'women' },
  { q: "What's the #1 thing women notice first about men?", options: ['Eyes', 'Smile', 'Height', 'Hands'], answer: 1, forTeam: 'men' },
  { q: "What's the average time men spend getting ready?", options: ['10 min', '20 min', '30 min', '45 min'], answer: 1, forTeam: 'women' },
  { q: "What % of women make the first move?", options: ['12%', '24%', '36%', '48%'], answer: 1, forTeam: 'men' },
];

export const BattleOfSexesScreen: React.FC<BattleOfSexesScreenProps> = ({
  eventId,
  onComplete,
  onBack,
}) => {
  const { user } = useAuth();
  const gameSession = eventId ? useGameSession({ eventId, gameType: 'battle_of_sexes' }) : null;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'waiting' | 'reveal' | 'transition' | 'results'>('intro');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [scores, setScores] = useState({ men: 0, women: 0 });
  const [chipsEarned, setChipsEarned] = useState(0);
  const totalRounds = QUESTIONS.length;

  // Determine current player's team based on their gender
  const myTeam = useMemo(() => {
    if (gameSession?.currentPlayer?.team) return gameSession.currentPlayer.team;
    // Fallback: check user profile gender
    return 'men'; // Default - would come from user profile
  }, [gameSession?.currentPlayer]);

  // Get team counts for display
  const teamCounts = useMemo(() => {
    if (!gameSession?.teams) return { men: 0, women: 0 };
    return {
      men: gameSession.teams.men.length,
      women: gameSession.teams.women.length,
    };
  }, [gameSession?.teams]);

  // Auto-assign teams when game starts
  useEffect(() => {
    if (phase === 'intro' && gameSession?.session && gameSession.isHost) {
      gameSession.assignTeams();
    }
  }, [phase, gameSession?.session, gameSession?.isHost]);

  const currentQ = QUESTIONS[(currentRound - 1) % QUESTIONS.length];

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
    setSelectedAnswer(index);
  };

  const handleReveal = () => {
    if (selectedAnswer === null) return;
    HapticService.medium();
    setPhase('waiting');

    setTimeout(() => {
      if (selectedAnswer === currentQ.answer) {
        HapticService.success();
        const team = currentQ.forTeam === 'men' ? 'women' : 'men';
        setScores(prev => ({ ...prev, [team]: prev[team] + 1 }));
        setChipsEarned(c => c + 10);
      }
      setPhase('reveal');
    }, 1500 + Math.random() * 1000);
  };

  const handleNext = () => {
    if (currentRound < totalRounds) {
      setPhase('transition');
    } else {
      setPhase('results');
    }
  };

  const startNextRound = () => {
    setCurrentRound(currentRound + 1);
    setSelectedAnswer(null);
    setTimeLeft(20);
    setPhase('playing');
  };

  // Results screen
  if (phase === 'results') {
    const winner = scores.men > scores.women ? 'Men' : scores.women > scores.men ? 'Women' : 'Tie';
    return (
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
          <GameResults
            gameName="Battle of Sexes"
            gameIcon="users"
            score={scores.men + scores.women}
            chipsEarned={chipsEarned}
            stats={[
              { label: 'Men Score', value: scores.men },
              { label: 'Women Score', value: scores.women },
              { label: 'Winner', value: winner },
            ]}
            onContinue={onComplete}
            onPlayAgain={() => {
              setPhase('intro');
              setCurrentRound(1);
              setScores({ men: 0, women: 0 });
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
        gameName="Battle of Sexes"
        gameIcon="users"
        description="Men vs Women! Answer questions about the opposite gender to score points for your team."
        rules={['Answer about the other team', 'Correct = point for your team', 'Most points wins!']}
        onComplete={() => setPhase('playing')}
      />

      <WaitingOverlay
        visible={phase === 'waiting'}
        message="Checking answers..."
      />

      <RoundTransition
        visible={phase === 'transition'}
        currentRound={currentRound + 1}
        totalRounds={totalRounds}
        message={`${currentQ.forTeam === 'men' ? 'Women' : 'Men'}'s turn next!`}
        onComplete={startNextRound}
      />

      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GameHeader title="Battle of Sexes" icon="users" currentRound={currentRound} totalRounds={totalRounds} timeLeft={timeLeft} showTimer={phase === 'playing'} />

          {/* Score Board */}
          <View style={styles.scoreBoard}>
            <LinearGradient colors={[colors.maleGradientStart, colors.maleGradientEnd]} style={styles.scoreTeam}>
              <Text style={styles.teamLabel}>Men</Text>
              <Text style={styles.teamScore}>{scores.men}</Text>
            </LinearGradient>
            <Text style={styles.vs}>VS</Text>
            <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.scoreTeam}>
              <Text style={styles.teamLabel}>Women</Text>
              <Text style={styles.teamScore}>{scores.women}</Text>
            </LinearGradient>
          </View>

          {/* Question */}
          <Animated.View key={currentRound} entering={SlideInRight.duration(400)}>
            <Card variant="elevated" style={styles.questionCard}>
              <Text style={styles.forTeam}>
                {currentQ.forTeam === 'men' ? '👨 Men answer:' : '👩 Women answer:'}
              </Text>
              <Text style={styles.question}>{currentQ.q}</Text>
              <View style={styles.options}>
                {currentQ.options.map((opt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.option,
                      selectedAnswer === i && styles.optionSelected,
                      phase === 'reveal' && i === currentQ.answer && styles.optionCorrect,
                      phase === 'reveal' && selectedAnswer === i && i !== currentQ.answer && styles.optionWrong
                    ]}
                    onPress={() => handleSelect(i)}
                    disabled={phase !== 'playing'}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Result message */}
          {phase === 'reveal' && (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.resultMessage}>
              <Text style={styles.resultText}>
                {selectedAnswer === currentQ.answer ? '✅ Correct! +10 chips' : '❌ Wrong answer!'}
              </Text>
            </Animated.View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {phase === 'playing' && (
              <Button title="Lock In" onPress={handleReveal} variant="primary" disabled={selectedAnswer === null} haptic="medium" />
            )}
            {phase === 'reveal' && (
              <Button title={currentRound < totalRounds ? 'Next Question' : 'See Results'} onPress={handleNext} variant="primary" haptic="medium" />
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
  scoreBoard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.lg },
  scoreTeam: { padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', minWidth: 100 },
  teamLabel: { fontSize: 14, color: '#fff', marginBottom: 5 },
  teamScore: { fontSize: 32, fontWeight: '900', color: '#fff' },
  vs: { fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  questionCard: { paddingVertical: spacing.xl },
  forTeam: { fontSize: 14, color: colors.primary, fontWeight: '600', textAlign: 'center', marginBottom: spacing.md },
  question: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 26 },
  options: { gap: spacing.sm },
  option: { padding: 14, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.md },
  optionSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.15)' },
  optionCorrect: { borderColor: colors.success, backgroundColor: 'rgba(52, 199, 89, 0.15)' },
  optionWrong: { borderColor: colors.error, backgroundColor: 'rgba(255, 59, 48, 0.15)' },
  optionText: { fontSize: 16, color: colors.text, textAlign: 'center' },
  resultMessage: { alignItems: 'center', marginBottom: spacing.lg },
  resultText: { fontSize: 18, color: colors.primary, fontWeight: '600' },
  buttonContainer: { paddingTop: spacing.xl },
  backButton: { marginTop: spacing.md },
});

export default BattleOfSexesScreen;



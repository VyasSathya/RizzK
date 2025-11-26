/**
 * BattleOfSexesScreen - Team trivia battle
 * Men vs Women trivia competition
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
import Animated, { FadeIn, SlideInRight, FadeInDown } from '../../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card } from '../../components/common';
import { GameHeader } from '../../components/games';
import { colors, spacing, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface BattleOfSexesScreenProps {
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
  onComplete,
  onBack,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState({ men: 0, women: 0 });
  const totalRounds = QUESTIONS.length;

  const currentQ = QUESTIONS[(currentRound - 1) % QUESTIONS.length];

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

  const handleSelect = (index: number) => {
    if (revealed) return;
    HapticService.light();
    setSelectedAnswer(index);
  };

  const handleReveal = () => {
    HapticService.medium();
    setRevealed(true);
    if (selectedAnswer === currentQ.answer) {
      HapticService.success();
      setScores(prev => ({
        ...prev,
        [currentQ.forTeam === 'men' ? 'women' : 'men']: prev[currentQ.forTeam === 'men' ? 'women' : 'men'] + 1
      }));
    }
  };

  const handleNext = () => {
    HapticService.light();
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      setSelectedAnswer(null);
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
        <View style={styles.content}>
          <GameHeader title="Battle of Sexes" icon="⚔️" currentRound={currentRound} totalRounds={totalRounds} timeLeft={timeLeft} showTimer={!revealed} />

          {/* Score Board */}
          <View style={styles.scoreBoard}>
            <LinearGradient colors={[colors.maleGradientStart, colors.maleGradientEnd]} style={styles.scoreTeam}>
              <Text style={styles.teamLabel}>👨 Men</Text>
              <Text style={styles.teamScore}>{scores.men}</Text>
            </LinearGradient>
            <Text style={styles.vs}>VS</Text>
            <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.scoreTeam}>
              <Text style={styles.teamLabel}>👩 Women</Text>
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
                    style={[styles.option, selectedAnswer === i && styles.optionSelected, revealed && i === currentQ.answer && styles.optionCorrect, revealed && selectedAnswer === i && i !== currentQ.answer && styles.optionWrong]}
                    onPress={() => handleSelect(i)}
                    disabled={revealed}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!revealed ? (
              <Button title="Lock In" onPress={handleReveal} variant="primary" disabled={selectedAnswer === null} haptic="medium" />
            ) : (
              <Button title={currentRound < totalRounds ? 'Next Question' : 'See Results'} onPress={handleNext} variant="primary" haptic="medium" />
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
  scoreBoard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 20 },
  scoreTeam: { padding: 15, borderRadius: borderRadius.md, alignItems: 'center', minWidth: 100 },
  teamLabel: { fontSize: 14, color: '#fff', marginBottom: 5 },
  teamScore: { fontSize: 32, fontWeight: '900', color: '#fff' },
  vs: { fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  questionCard: { paddingVertical: 25 },
  forTeam: { fontSize: 14, color: colors.primary, fontWeight: '600', textAlign: 'center', marginBottom: 15 },
  question: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 20, lineHeight: 26 },
  options: { gap: 10 },
  option: { padding: 15, backgroundColor: colors.glassBg, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: borderRadius.md },
  optionSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.2)' },
  optionCorrect: { borderColor: colors.success, backgroundColor: 'rgba(52, 199, 89, 0.2)' },
  optionWrong: { borderColor: colors.error, backgroundColor: 'rgba(255, 59, 48, 0.2)' },
  optionText: { fontSize: 16, color: colors.text, textAlign: 'center' },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.md },
  backButton: { marginTop: spacing.md },
});

export default BattleOfSexesScreen;




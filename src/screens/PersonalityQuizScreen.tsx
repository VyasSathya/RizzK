/**
 * PersonalityQuizScreen - Personality quiz for matching
 * Matches the HTML prototype quiz screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from '../shims/reanimated';
import { GradientBackground, Button, Card } from '../components/common';
import { colors, spacing, borderRadius , fonts } from '../theme';
import { HapticService } from '../services/haptics';

interface PersonalityQuizScreenProps {
  onComplete: (answers: Record<string, string>) => void;
}

const QUESTIONS = [
  { id: 'q1', question: 'How do you prefer to spend your Friday night?', options: ['Going out with friends', 'Cozy night in', 'Trying something new', 'Depends on my mood'] },
  { id: 'q2', question: 'What\'s your ideal first date?', options: ['Coffee and conversation', 'Adventure activity', 'Dinner at a nice restaurant', 'Something creative like art or cooking'] },
  { id: 'q3', question: 'How do you handle conflict?', options: ['Talk it out immediately', 'Need time to process', 'Avoid it if possible', 'Find a compromise'] },
  { id: 'q4', question: 'What matters most in a partner?', options: ['Sense of humor', 'Ambition', 'Kindness', 'Intelligence'] },
  { id: 'q5', question: 'How social are you?', options: ['Life of the party', 'Selectively social', 'Prefer small groups', 'Introvert at heart'] },
  { id: 'q6', question: 'What\'s your communication style?', options: ['Constant texter', 'Quality over quantity', 'Phone calls preferred', 'In-person is best'] },
  { id: 'q7', question: 'How do you show affection?', options: ['Words of affirmation', 'Physical touch', 'Acts of service', 'Quality time'] },
  { id: 'q8', question: 'What\'s your approach to planning?', options: ['Detailed planner', 'Go with the flow', 'Mix of both', 'Last minute decisions'] },
  { id: 'q9', question: 'How important is alone time?', options: ['Essential daily', 'Nice to have', 'Don\'t need much', 'Prefer company always'] },
  { id: 'q10', question: 'What\'s your love language?', options: ['Words', 'Touch', 'Gifts', 'Time together'] },
];

export const PersonalityQuizScreen: React.FC<PersonalityQuizScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleOptionSelect = (option: string) => {
    HapticService.light();
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) {
      HapticService.error();
      return;
    }

    HapticService.medium();
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      HapticService.success();
      onComplete(newAnswers);
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Personality Quiz</Text>
            <Text style={styles.subtitle}>Help us match you with compatible people</Text>
            <Text style={styles.progress}>Question {currentIndex + 1} of {QUESTIONS.length}</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* Question Card */}
          <Animated.View key={currentQuestion.id} entering={FadeInRight.duration(300)}>
            <Card variant="elevated" style={styles.questionCard}>
              <Text style={styles.question}>{currentQuestion.question}</Text>
              
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, selectedOption === option && styles.optionSelected]}
                    onPress={() => handleOptionSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, selectedOption === option && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={currentIndex === QUESTIONS.length - 1 ? 'Complete Quiz' : 'Next'}
              onPress={handleNext}
              variant="primary"
              disabled={!selectedOption}
              haptic="medium"
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 28, fontFamily: fonts.headingBold, color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 10 },
  progress: { fontSize: 14, color: colors.textTertiary },
  progressBar: { width: '100%', height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, marginTop: 15, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  questionCard: { paddingVertical: 30 },
  question: { fontSize: 20, fontWeight: '600', color: colors.text, lineHeight: 28, marginBottom: 25, textAlign: 'center' },
  optionsContainer: { gap: 12 },
  option: { backgroundColor: colors.glassBg, borderWidth: 2, borderColor: 'rgba(255, 20, 147, 0.2)', borderRadius: borderRadius.md, padding: 18 },
  optionSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.2)', shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10 },
  optionText: { fontSize: 16, color: colors.text, textAlign: 'center' },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  buttonContainer: { marginTop: 'auto', paddingTop: spacing.xl },
});

export default PersonalityQuizScreen;






/**
 * Quiz Service
 * Handles personality quiz responses
 */

import { supabase } from './supabase';

export interface QuizResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  created_at: string;
}

/**
 * Save quiz responses
 */
export async function saveQuizResponses(answers: Record<string, string>): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Must be logged in');

  // Delete existing responses first (allow retake)
  await supabase
    .from('quiz_responses')
    .delete()
    .eq('user_id', user.id);

  // Insert new responses
  const responses = Object.entries(answers).map(([questionId, answer]) => ({
    user_id: user.id,
    question_id: questionId,
    answer,
  }));

  const { error } = await supabase
    .from('quiz_responses')
    .insert(responses);

  if (error) throw error;

  // Calculate and save personality scores
  await calculatePersonalityScores(user.id, answers);
}

/**
 * Calculate personality scores from quiz answers
 */
async function calculatePersonalityScores(userId: string, answers: Record<string, string>): Promise<void> {
  // Simple scoring - can be made more sophisticated
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  // Map answers to traits (simplified)
  Object.entries(answers).forEach(([qId, answer]) => {
    const idx = parseInt(qId.replace('q', '')) || 0;
    if (idx <= 2) scores.openness += answer.length;
    else if (idx <= 4) scores.conscientiousness += answer.length;
    else if (idx <= 6) scores.extraversion += answer.length;
    else if (idx <= 8) scores.agreeableness += answer.length;
    else scores.neuroticism += answer.length;
  });

  // Normalize to 0-100
  const normalize = (v: number) => Math.min(100, Math.max(0, v * 5));
  
  // Upsert personality scores
  const { error } = await supabase
    .from('personality_scores')
    .upsert({
      user_id: userId,
      openness: normalize(scores.openness),
      conscientiousness: normalize(scores.conscientiousness),
      extraversion: normalize(scores.extraversion),
      agreeableness: normalize(scores.agreeableness),
      neuroticism: normalize(scores.neuroticism),
    }, { onConflict: 'user_id' });

  if (error) console.warn('Failed to save personality scores:', error);
}

/**
 * Get user's quiz responses
 */
export async function getQuizResponses(): Promise<QuizResponse[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('quiz_responses')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data || [];
}

/**
 * Check if user has completed quiz
 */
export async function hasCompletedQuiz(): Promise<boolean> {
  const responses = await getQuizResponses();
  return responses.length >= 10;
}


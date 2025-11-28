/**
 * MatchSelectionScreen - Select who you want to match with
 * Connected to Supabase
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Avatar, Icon } from '../components/common';
import { colors, spacing, borderRadius, shadows, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { getOtherPlayers } from '../services/lobby';
import { createMatch } from '../services/matches';

interface Player { id: string; name: string; age: number; gender: 'male' | 'female'; matchScore: number; }
interface MatchSelectionScreenProps {
  eventId?: string;
  onSubmit: (selectedIds: string[]) => void;
}

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Maya', age: 24, gender: 'female', matchScore: 88 },
  { id: '2', name: 'Alex', age: 26, gender: 'male', matchScore: 92 },
  { id: '3', name: 'Sam', age: 25, gender: 'male', matchScore: 85 },
  { id: '4', name: 'Jordan', age: 23, gender: 'female', matchScore: 78 },
  { id: '5', name: 'Taylor', age: 27, gender: 'male', matchScore: 82 },
];

const PlayerCard: React.FC<{ player: Player; isSelected: boolean; onPress: () => void; delay: number; }> = ({ player, isSelected, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity style={[styles.playerCard, isSelected && styles.playerCardSelected]} onPress={() => { HapticService.light(); onPress(); }} activeOpacity={0.85}>
      <View style={styles.avatarGlow}><Avatar name={player.name} size={50} gender={player.gender} /></View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}, {player.age}</Text>
        <View style={styles.matchScoreContainer}>
          <View style={styles.matchBar}>
            <LinearGradient colors={[colors.primary, colors.primaryLight]} style={[styles.matchBarFill, { width: player.matchScore + '%' }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </View>
          <Text style={styles.matchScore}>{player.matchScore}%</Text>
        </View>
      </View>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>{isSelected && <Icon name="check" size={16} color="#fff" />}</View>
    </TouchableOpacity>
  </Animated.View>
);

export const MatchSelectionScreen: React.FC<MatchSelectionScreenProps> = ({ eventId, onSubmit }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [loading, setLoading] = useState(!!eventId);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) loadPlayers();
  }, [eventId]);

  const loadPlayers = async () => {
    try {
      const attendees = await getOtherPlayers(eventId!);
      if (attendees.length > 0) {
        setPlayers(attendees.map(a => ({
          id: a.user_id,
          name: a.profile?.full_name || 'Player',
          age: 25,
          gender: (a.profile?.gender as 'male' | 'female') || 'female',
          matchScore: Math.floor(70 + Math.random() * 25),
        })));
      }
    } catch (error) {
      console.warn('Failed to load players:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (id: string) => {
    selectedIds.includes(id) ? setSelectedIds(selectedIds.filter(i => i !== id)) : setSelectedIds([...selectedIds, id]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Create matches for each selected player
      if (eventId) {
        for (const playerId of selectedIds) {
          await createMatch(playerId, eventId);
        }
      }
      HapticService.success();
      onSubmit(selectedIds);
    } catch (error) {
      console.warn('Failed to create matches:', error);
      HapticService.success();
      onSubmit(selectedIds);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View style={styles.headerIconGlow}><Icon name="heart" size={60} color={colors.primary} /></View>
            <Text style={styles.title}>Who Did You Vibe With?</Text>
            <Text style={styles.subtitle}>Select the people you would like to match with. If they select you too, it is a match!</Text>
          </Animated.View>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
          ) : (
            <>
              <View style={styles.playersList}>{players.map((player, index) => (<PlayerCard key={player.id} player={player} isSelected={selectedIds.includes(player.id)} onPress={() => togglePlayer(player.id)} delay={200 + index * 100} />))}</View>
              <Text style={styles.selectionCount}>{selectedIds.length} {selectedIds.length === 1 ? 'person' : 'people'} selected</Text>
              <Button title={submitting ? 'Submitting...' : selectedIds.length > 0 ? 'Submit Matches' : 'Skip for Now'} onPress={handleSubmit} variant="primary" size="large" haptic="success" disabled={submitting} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  headerIconGlow: { ...shadows.glowIntense },
  title: { fontSize: 28, fontFamily: fonts.headingBold, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.lg, letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  playersList: { gap: spacing.sm, marginBottom: spacing.lg },
  playerCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.lg, gap: 12 },
  playerCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.15)', ...shadows.glow },
  avatarGlow: { ...shadows.glow },
  playerInfo: { flex: 1, marginLeft: 2 },
  playerName: { fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: 6, letterSpacing: 0.3 },
  matchScoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchBar: { flex: 1, height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' },
  matchBarFill: { height: '100%', borderRadius: 2 },
  matchScore: { fontSize: 14, color: colors.primary, fontWeight: '600', width: 38, textAlign: 'right' },
  checkbox: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  selectionCount: { textAlign: 'center', color: colors.textTertiary, fontSize: 14, marginBottom: spacing.lg, letterSpacing: 1 },
});

export default MatchSelectionScreen;




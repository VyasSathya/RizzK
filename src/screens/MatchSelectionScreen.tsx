/**
 * MatchSelectionScreen - Select who you want to match with
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Animated, { FadeInDown, FadeIn } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Avatar, Icon } from '../components/common';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { HapticService } from '../services/haptics';

interface Player { id: string; name: string; age: number; gender: 'male' | 'female'; matchScore: number; }
interface MatchSelectionScreenProps { onSubmit: (selectedIds: string[]) => void; }

const PLAYERS: Player[] = [
  { id: '1', name: 'Maya', age: 24, gender: 'female', matchScore: 88 },
  { id: '2', name: 'Alex', age: 26, gender: 'male', matchScore: 92 },
  { id: '3', name: 'Sam', age: 25, gender: 'male', matchScore: 85 },
  { id: '4', name: 'Jordan', age: 23, gender: 'female', matchScore: 78 },
  { id: '5', name: 'Taylor', age: 27, gender: 'male', matchScore: 82 },
];

const PlayerCard: React.FC<{ player: Player; isSelected: boolean; onPress: () => void; delay: number; }> = ({ player, isSelected, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity style={[styles.playerCard, isSelected && styles.playerCardSelected]} onPress={() => { HapticService.light(); onPress(); }} activeOpacity={0.85}>
      <View style={styles.avatarGlow}><Avatar name={player.name} size={55} gender={player.gender} /></View>
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

export const MatchSelectionScreen: React.FC<MatchSelectionScreenProps> = ({ onSubmit }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const togglePlayer = (id: string) => { selectedIds.includes(id) ? setSelectedIds(selectedIds.filter(i => i !== id)) : setSelectedIds([...selectedIds, id]); };
  const handleSubmit = () => { HapticService.success(); onSubmit(selectedIds); };

  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View style={styles.headerIconGlow}><Icon name="heart" size={60} color={colors.primary} /></View>
            <Text style={styles.title}>Who Did You Vibe With?</Text>
            <Text style={styles.subtitle}>Select the people you would like to match with. If they select you too, it is a match!</Text>
          </Animated.View>
          <View style={styles.playersList}>{PLAYERS.map((player, index) => (<PlayerCard key={player.id} player={player} isSelected={selectedIds.includes(player.id)} onPress={() => togglePlayer(player.id)} delay={200 + index * 100} />))}</View>
          <Text style={styles.selectionCount}>{selectedIds.length} {selectedIds.length === 1 ? 'person' : 'people'} selected</Text>
          <Button title={selectedIds.length > 0 ? 'Submit Matches' : 'Skip for Now'} onPress={handleSubmit} variant="primary" size="large" haptic="success" />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerIconGlow: { ...shadows.glowIntense },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 12, marginTop: 20, letterSpacing: 0.5 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  playersList: { gap: 15, marginBottom: 25 },
  playerCard: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: colors.glassBg, borderWidth: 2, borderColor: 'rgba(255, 20, 147, 0.2)', borderRadius: borderRadius.lg, gap: 15 },
  playerCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.15)', ...shadows.glow },
  avatarGlow: { ...shadows.glow },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8, letterSpacing: 0.5 },
  matchScoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchBar: { flex: 1, height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' },
  matchBarFill: { height: '100%', borderRadius: 2 },
  matchScore: { fontSize: 14, color: colors.primary, fontWeight: '600', width: 40 },
  checkbox: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  selectionCount: { textAlign: 'center', color: colors.textTertiary, fontSize: 14, marginBottom: 20, letterSpacing: 1 },
});

export default MatchSelectionScreen;

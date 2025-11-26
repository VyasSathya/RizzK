/**
 * MatchSelectionScreen - Select who you want to match with
 * After games complete, players choose their matches
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

interface Player {
  id: string;
  name: string;
  age: number;
  avatar: string;
  gender: 'male' | 'female';
  matchScore: number;
}

interface MatchSelectionScreenProps {
  onSubmit: (selectedIds: string[]) => void;
}

const PLAYERS: Player[] = [
  { id: '1', name: 'Maya', age: 24, avatar: '👩', gender: 'female', matchScore: 88 },
  { id: '2', name: 'Alex', age: 26, avatar: '👨', gender: 'male', matchScore: 92 },
  { id: '3', name: 'Sam', age: 25, avatar: '🧔', gender: 'male', matchScore: 85 },
  { id: '4', name: 'Jordan', age: 23, avatar: '👱‍♀️', gender: 'female', matchScore: 78 },
  { id: '5', name: 'Taylor', age: 27, avatar: '👨‍🦱', gender: 'male', matchScore: 82 },
];

const PlayerCard: React.FC<{
  player: Player;
  isSelected: boolean;
  onPress: () => void;
  delay: number;
}> = ({ player, isSelected, onPress, delay }) => {
  const gradientColors = player.gender === 'female'
    ? [colors.primary, colors.primaryLight]
    : [colors.maleGradientStart, colors.maleGradientEnd];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        style={[styles.playerCard, isSelected && styles.playerCardSelected]}
        onPress={() => {
          HapticService.light();
          onPress();
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.avatarText}>{player.avatar}</Text>
        </LinearGradient>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}, {player.age}</Text>
          <Text style={styles.matchScore}>{player.matchScore}% match</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>❤️</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MatchSelectionScreen: React.FC<MatchSelectionScreenProps> = ({
  onSubmit,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const togglePlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = () => {
    HapticService.success();
    onSubmit(selectedIds);
  };

  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <Text style={styles.icon}>💕</Text>
            <Text style={styles.title}>Who Did You Vibe With?</Text>
            <Text style={styles.subtitle}>
              Select the people you'd like to match with.{'\n'}
              If they select you too, it's a match!
            </Text>
          </Animated.View>

          {/* Players List */}
          <View style={styles.playersList}>
            {PLAYERS.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedIds.includes(player.id)}
                onPress={() => togglePlayer(player.id)}
                delay={200 + index * 100}
              />
            ))}
          </View>

          {/* Selection Count */}
          <Text style={styles.selectionCount}>
            {selectedIds.length} {selectedIds.length === 1 ? 'person' : 'people'} selected
          </Text>

          {/* Submit Button */}
          <Button
            title={selectedIds.length > 0 ? 'Submit Matches' : 'Skip for Now'}
            onPress={handleSubmit}
            variant="primary"
            haptic="success"
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  icon: { fontSize: 60, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  playersList: { gap: 12, marginBottom: 20 },
  playerCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: colors.glassBg, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: borderRadius.lg, gap: 15 },
  playerCardSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.15)' },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  matchScore: { fontSize: 14, color: colors.primary },
  checkbox: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: colors.primary, backgroundColor: 'rgba(255, 20, 147, 0.3)' },
  checkmark: { fontSize: 16 },
  selectionCount: { textAlign: 'center', color: colors.textSecondary, fontSize: 14, marginBottom: 20 },
});

export default MatchSelectionScreen;



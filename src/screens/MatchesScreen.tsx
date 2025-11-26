/**
 * MatchesScreen - View your matches
 * Shows mutual matches from game nights
 */

import React from 'react';
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
import { GradientBackground, Card, Logo } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

interface Match {
  id: string;
  name: string;
  age: number;
  avatar: string;
  gender: 'male' | 'female';
  matchScore: number;
  eventName: string;
  lastMessage?: string;
  unread?: boolean;
}

interface MatchesScreenProps {
  onMatchPress: (matchId: string) => void;
}

const MATCHES: Match[] = [
  { id: '1', name: 'Maya', age: 24, avatar: '👩', gender: 'female', matchScore: 88, eventName: 'Friday Night Games', lastMessage: 'Hey! Great meeting you last night 😊', unread: true },
  { id: '2', name: 'Alex', age: 26, avatar: '👨', gender: 'male', matchScore: 92, eventName: 'Friday Night Games', lastMessage: 'That was so fun! We should do it again' },
  { id: '3', name: 'Jordan', age: 23, avatar: '👱‍♀️', gender: 'female', matchScore: 78, eventName: 'Saturday Social' },
];

const MatchCard: React.FC<{
  match: Match;
  onPress: () => void;
  delay: number;
}> = ({ match, onPress, delay }) => {
  const gradientColors = match.gender === 'female'
    ? [colors.primary, colors.primaryLight]
    : [colors.maleGradientStart, colors.maleGradientEnd];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <TouchableOpacity
        style={styles.matchCard}
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
          <Text style={styles.avatarText}>{match.avatar}</Text>
        </LinearGradient>
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{match.name}, {match.age}</Text>
            {match.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.matchScore}>{match.matchScore}% match • {match.eventName}</Text>
          {match.lastMessage && (
            <Text style={[styles.lastMessage, match.unread && styles.lastMessageUnread]} numberOfLines={1}>
              {match.lastMessage}
            </Text>
          )}
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ onMatchPress }) => {
  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Logo size="medium" animated={false} />
            <Text style={styles.subtitle}>Your Matches</Text>
          </View>

          {/* New Matches Section */}
          {MATCHES.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>💕 Mutual Matches</Text>
              <View style={styles.matchesList}>
                {MATCHES.map((match, index) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onPress={() => onMatchPress(match.id)}
                    delay={index * 100}
                  />
                ))}
              </View>
            </>
          )}

          {/* Empty State */}
          {MATCHES.length === 0 && (
            <Card variant="subtle" style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💔</Text>
              <Text style={styles.emptyTitle}>No Matches Yet</Text>
              <Text style={styles.emptyText}>
                Join a game night to meet new people and find your matches!
              </Text>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  subtitle: { color: colors.textSecondary, marginTop: 10, fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 },
  matchesList: { gap: 12 },
  matchCard: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: colors.glassBg, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: borderRadius.lg, gap: 15 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28 },
  matchInfo: { flex: 1 },
  matchHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchName: { fontSize: 18, fontWeight: '600', color: colors.text },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  matchScore: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  lastMessage: { fontSize: 14, color: colors.textTertiary, marginTop: 6 },
  lastMessageUnread: { color: colors.text, fontWeight: '500' },
  arrow: { fontSize: 20, color: colors.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 10 },
  emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});

export default MatchesScreen;



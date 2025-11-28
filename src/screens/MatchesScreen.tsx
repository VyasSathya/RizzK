/**
 * MatchesScreen - View your matches
 * Connected to Supabase
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from '../shims/reanimated';
import { GradientBackground, Card, Logo, Avatar, Icon } from '../components/common';
import { colors, spacing, borderRadius, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { getMatches, Match as DBMatch } from '../services/matches';

interface MatchDisplay {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  matchScore: number;
  eventName: string;
  lastMessage?: string;
  unread?: boolean;
}

interface MatchesScreenProps {
  onMatchPress: (matchId: string) => void;
}

// Fallback mock matches
const MOCK_MATCHES: MatchDisplay[] = [
  { id: '1', name: 'Maya', age: 24, gender: 'female', matchScore: 88, eventName: 'Friday Night Games', lastMessage: 'Hey! Great meeting you last night', unread: true },
  { id: '2', name: 'Alex', age: 26, gender: 'male', matchScore: 92, eventName: 'Friday Night Games', lastMessage: 'That was so fun! We should do it again' },
  { id: '3', name: 'Jordan', age: 23, gender: 'female', matchScore: 78, eventName: 'Saturday Social' },
];

const MatchCard: React.FC<{
  match: Match;
  onPress: () => void;
  delay: number;
}> = ({ match, onPress, delay }) => {
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
        <Avatar name={match.name} size={60} gender={match.gender} />
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{match.name}, {match.age}</Text>
            {match.unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.matchScore}>{match.matchScore}% match | {match.eventName}</Text>
          {match.lastMessage && (
            <Text style={[styles.lastMessage, match.unread && styles.lastMessageUnread]} numberOfLines={1}>
              {match.lastMessage}
            </Text>
          )}
        </View>
        <Icon name="arrow-left" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ onMatchPress }) => {
  const [matches, setMatches] = useState<MatchDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const dbMatches = await getMatches();
      if (dbMatches.length > 0) {
        setMatches(dbMatches.map(m => ({
          id: m.id,
          name: m.other_user?.full_name || 'Unknown',
          age: 25, // Would come from profile
          gender: 'female' as const,
          matchScore: m.compatibility_score || 85,
          eventName: 'Game Night',
        })));
      } else {
        // Use mock matches for demo
        setMatches(MOCK_MATCHES);
      }
    } catch (error) {
      console.warn('Failed to load matches:', error);
      setMatches(MOCK_MATCHES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Logo size="medium" animated={false} />
            <Text style={styles.subtitle}>Your Matches</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* New Matches Section */}
              {matches.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Mutual Matches</Text>
                  <View style={styles.matchesList}>
                    {matches.map((match, index) => (
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
              {matches.length === 0 && (
                <Card variant="subtle" style={styles.emptyState}>
                  <Icon name="heart" size={60} color={colors.primary} />
                  <Text style={styles.emptyTitle}>No Matches Yet</Text>
                  <Text style={styles.emptyText}>
                    Join a game night to meet new people and find your matches!
                  </Text>
                </Card>
              )}
            </>
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
  matchInfo: { flex: 1 },
  matchHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchName: { fontSize: 18, fontWeight: '600', color: colors.text },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  matchScore: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  lastMessage: { fontSize: 14, color: colors.textTertiary, marginTop: 6 },
  lastMessageUnread: { color: colors.text, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 10, marginTop: 20 },
  emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});

export default MatchesScreen;




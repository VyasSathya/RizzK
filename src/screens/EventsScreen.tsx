/**
 * EventsScreen - List of upcoming game nights
 * Matches the HTML prototype events list
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
import Animated, { FadeInDown } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Card, Logo } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  people: number;
  price: number;
}

interface EventsScreenProps {
  onEventPress: (eventId: string) => void;
}

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Friday Night Games', date: 'Tonight', time: '8:00 PM', venue: 'The Lounge', people: 6, price: 35 },
  { id: '2', title: 'Saturday Social', date: 'Tomorrow', time: '7:30 PM', venue: 'Velvet Bar', people: 8, price: 40 },
  { id: '3', title: 'Sunday Vibes', date: 'Sun', time: '6:00 PM', venue: 'Rooftop Lounge', people: 6, price: 30 },
];

const EventCard: React.FC<{ event: Event; onPress: () => void; delay: number }> = ({ event, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        HapticService.light();
        onPress();
      }}
      activeOpacity={0.8}
    >
      <View style={styles.eventHeader}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.eventIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.eventIconText}>📅</Text>
        </LinearGradient>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>{event.date} • {event.time}</Text>
        </View>
      </View>
      <View style={styles.eventMeta}>
        <Text style={styles.metaItem}>📍 {event.venue}</Text>
        <Text style={styles.metaItem}>👥 {event.people} people</Text>
        <Text style={styles.metaItem}>💵 ${event.price}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export const EventsScreen: React.FC<EventsScreenProps> = ({ onEventPress }) => {
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
            <Text style={styles.subtitle}>Upcoming Game Nights</Text>
          </View>

          {/* Events List */}
          <View style={styles.eventsList}>
            {MOCK_EVENTS.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => onEventPress(event.id)}
                delay={index * 100}
              />
            ))}
          </View>

          {/* Empty State (if no events) */}
          {MOCK_EVENTS.length === 0 && (
            <Card variant="subtle" style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎮</Text>
              <Text style={styles.emptyTitle}>No Events Yet</Text>
              <Text style={styles.emptyText}>
                Check back soon for upcoming game nights in your area!
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
  eventsList: { gap: 15 },
  eventCard: {
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    padding: 20,
  },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 12 },
  eventIcon: { width: 60, height: 60, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  eventIconText: { fontSize: 30 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 5 },
  eventDate: { fontSize: 14, color: colors.textSecondary },
  eventMeta: { flexDirection: 'row', gap: 15 },
  metaItem: { fontSize: 13, color: colors.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 10 },
  emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
});

export default EventsScreen;



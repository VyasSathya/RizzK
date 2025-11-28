/**
 * EventsScreen - List of upcoming game nights
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
import Animated, { FadeInDown } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Logo, Icon } from '../components/common';
import { colors, spacing, borderRadius, shadows, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { getEvents, Event as DBEvent } from '../services/events';

interface EventDisplay {
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

// Fallback mock events when DB is empty
const MOCK_EVENTS: EventDisplay[] = [
  { id: '1', title: 'Friday Night Games', date: 'Tonight', time: '8:00 PM', venue: 'The Lounge', people: 6, price: 35 },
  { id: '2', title: 'Saturday Social', date: 'Tomorrow', time: '7:30 PM', venue: 'Velvet Bar', people: 8, price: 40 },
  { id: '3', title: 'Sunday Vibes', date: 'Sun', time: '6:00 PM', venue: 'Rooftop Lounge', people: 6, price: 30 },
];

// Format DB event for display
const formatEvent = (event: DBEvent): EventDisplay => {
  const eventDate = new Date(event.date);
  return {
    id: event.id,
    title: event.title,
    date: eventDate.toLocaleDateString('en-US', { weekday: 'short' }),
    time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    venue: event.venue_name,
    people: event.attendee_count || 0,
    price: event.price,
  };
};

const EventCard: React.FC<{ event: Event; onPress: () => void; delay: number }> = ({ event, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        HapticService.light();
        onPress();
      }}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['rgba(255, 20, 147, 0.12)', 'rgba(255, 20, 147, 0.03)']}
        style={styles.eventCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.eventHeader}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.eventIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="calendar" size={24} color="#fff" />
          </LinearGradient>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date} | {event.time}</Text>
          </View>
        </View>
        <View style={styles.eventMeta}>
          <View style={styles.metaRow}>
            <Icon name="map-pin" size={14} color={colors.textTertiary} />
            <Text style={styles.metaItem}>{event.venue}</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="users" size={14} color={colors.textTertiary} />
            <Text style={styles.metaItem}>{event.people} people</Text>
          </View>
          <View style={styles.metaRow}>
            <Icon name="dollar-sign" size={14} color={colors.textTertiary} />
            <Text style={styles.metaItem}>\</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

export const EventsScreen: React.FC<EventsScreenProps> = ({ onEventPress }) => {
  const [events, setEvents] = useState<EventDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const dbEvents = await getEvents();
      if (dbEvents.length > 0) {
        setEvents(dbEvents.map(formatEvent));
      } else {
        // Use mock events if DB is empty
        setEvents(MOCK_EVENTS);
      }
    } catch (error) {
      console.warn('Failed to load events, using mock data:', error);
      setEvents(MOCK_EVENTS);
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
            <Text style={styles.subtitle}>Upcoming Game Nights</Text>
          </View>

          {/* Events List */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.eventsList}>
              {events.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => onEventPress(event.id)}
                  delay={index * 100}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  header: { alignItems: 'center', marginBottom: 30 },
  subtitle: { 
    color: colors.textSecondary, 
    marginTop: 12, 
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  eventsList: { gap: spacing.lg },
  eventCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  eventCardGradient: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
  },
  eventHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  eventIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  eventInfo: { flex: 1 },
  eventTitle: { 
    fontSize: 18, 
    fontFamily: fonts.headingBold, 
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  eventDate: { fontSize: 14, color: colors.textSecondary },
  eventMeta: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaItem: { fontSize: 13, color: colors.textTertiary },
});

export default EventsScreen;




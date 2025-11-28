/**
 * EventDetailScreen - Event details and registration
 * Connected to Supabase
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card, Icon } from '../components/common';
import { colors, spacing, borderRadius, fonts } from '../theme';
import { HapticService } from '../services/haptics';
import { getEvent, registerForEvent, isUserRegistered, Event } from '../services/events';
import { useAuth } from '../contexts/AuthContext';

interface EventDetailScreenProps {
  eventId: string;
  onRegister: () => void;
  onBack: () => void;
}

interface EventDisplay {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  people: number;
  price: number;
  description: string;
  includes: string[];
}

const DEFAULT_INCLUDES = ['Welcome drink', '7 interactive games', 'Personality matching', 'Private chat with matches'];

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onRegister,
  onBack,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState<EventDisplay>({
    title: 'Loading...',
    date: '',
    time: '',
    venue: '',
    address: '',
    people: 0,
    price: 0,
    description: '',
    includes: DEFAULT_INCLUDES,
  });

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const dbEvent = await getEvent(eventId);
      if (dbEvent) {
        const eventDate = new Date(dbEvent.date);
        setEvent({
          title: dbEvent.title,
          date: eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
          time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          venue: dbEvent.venue_name,
          address: dbEvent.venue_address,
          people: dbEvent.capacity,
          price: dbEvent.price,
          description: dbEvent.description || 'Join us for an exciting night of games, laughter, and connections!',
          includes: DEFAULT_INCLUDES,
        });

        // Check if user is already registered
        const registered = await isUserRegistered(eventId);
        setIsRegistered(registered);
      }
    } catch (err) {
      console.warn('Failed to load event:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      setError('Please log in to register');
      HapticService.error();
      return;
    }

    setError('');
    HapticService.medium();
    setLoading(true);

    try {
      await registerForEvent(eventId);
      HapticService.success();
      onRegister();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      HapticService.error();
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)}>
            <Card variant="elevated" style={styles.card}>
              {/* Event Header */}
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="play" size={50} color="#fff" />
                <Text style={styles.headerTitle}>{event.title}</Text>
              </LinearGradient>

              {/* Event Details */}
              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Icon name="calendar" size={24} color={colors.primary} />
                  <View>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>{event.date}</Text>
                    <Text style={styles.detailSubvalue}>{event.time}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="map-pin" size={24} color={colors.primary} />
                  <View>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{event.venue}</Text>
                    <Text style={styles.detailSubvalue}>{event.address}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Icon name="users" size={24} color={colors.primary} />
                  <View>
                    <Text style={styles.detailLabel}>Group Size</Text>
                    <Text style={styles.detailValue}>{event.people} people</Text>
                    <Text style={styles.detailSubvalue}>Personality matched</Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About This Event</Text>
                <Text style={styles.description}>{event.description}</Text>
              </View>

              {/* What's Included */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What's Included</Text>
                {event.includes.map((item, index) => (
                  <View key={index} style={styles.includeRow}>
                    <Icon name="check" size={16} color={colors.success} />
                    <Text style={styles.includeItem}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>\</Text>
              </View>

              {/* Error */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Buttons */}
              <Button
                title={isRegistered ? "Already Registered ✓" : "Register Now"}
                onPress={handleRegister}
                variant="primary"
                disabled={loading || isRegistered}
                haptic="medium"
              />
              <Button
                title="Back to Events"
                onPress={onBack}
                variant="secondary"
                style={styles.backButton}
              />
            </Card>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: spacing.xl, paddingTop: 40, paddingBottom: 80 },
  card: { paddingVertical: 0, overflow: 'hidden' },
  headerGradient: { padding: 30, alignItems: 'center', marginHorizontal: -spacing.xl, marginTop: -spacing.xl },
  headerTitle: { fontSize: 24, fontFamily: fonts.headingBold, color: '#fff', marginTop: 10 },
  details: { paddingTop: 25, gap: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  detailLabel: { fontSize: 12, color: colors.textTertiary, marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  detailSubvalue: { fontSize: 14, color: colors.textSecondary },
  section: { marginTop: 25, paddingTop: 25, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  includeItem: { fontSize: 15, color: colors.textSecondary },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, paddingTop: 25, borderTopWidth: 1, borderTopColor: colors.cardBorder, marginBottom: 25 },
  priceLabel: { fontSize: 16, color: colors.textSecondary },
  price: { fontSize: 32, fontWeight: '700', color: colors.primary },
  backButton: { marginTop: spacing.md },
  errorText: { color: colors.error, fontSize: 14, textAlign: 'center', marginBottom: spacing.md },
});

export default EventDetailScreen;




/**
 * EventDetailScreen - Event details and registration
 * Matches the HTML prototype event detail screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Button, Card } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

interface EventDetailScreenProps {
  eventId: string;
  onRegister: () => void;
  onBack: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onRegister,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);

  // Mock event data
  const event = {
    title: 'Friday Night Games',
    date: 'Friday, Dec 15',
    time: '8:00 PM - 11:00 PM',
    venue: 'The Lounge',
    address: '123 Main St, Downtown',
    people: 6,
    price: 35,
    description: 'Join us for an exciting night of games, laughter, and connections! Meet 5-7 personality-matched singles and play 7 fun games designed to break the ice and spark chemistry.',
    includes: ['Welcome drink', '7 interactive games', 'Personality matching', 'Private chat with matches'],
  };

  const handleRegister = async () => {
    HapticService.medium();
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      HapticService.success();
      onRegister();
    }, 1500);
  };

  return (
    <GradientBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
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
                <Text style={styles.headerIcon}>🎮</Text>
                <Text style={styles.headerTitle}>{event.title}</Text>
              </LinearGradient>

              {/* Event Details */}
              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <View>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>{event.date}</Text>
                    <Text style={styles.detailSubvalue}>{event.time}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <View>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{event.venue}</Text>
                    <Text style={styles.detailSubvalue}>{event.address}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>👥</Text>
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
                  <Text key={index} style={styles.includeItem}>✓ {item}</Text>
                ))}
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>${event.price}</Text>
              </View>

              {/* Buttons */}
              <Button
                title="Register Now"
                onPress={handleRegister}
                variant="primary"
                loading={loading}
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
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  card: { paddingVertical: 0, overflow: 'hidden' },
  headerGradient: { padding: 30, alignItems: 'center', marginHorizontal: -spacing.xl, marginTop: -spacing.xl },
  headerIcon: { fontSize: 50, marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  details: { paddingTop: 25, gap: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  detailIcon: { fontSize: 24 },
  detailLabel: { fontSize: 12, color: colors.textTertiary, marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  detailSubvalue: { fontSize: 14, color: colors.textSecondary },
  section: { marginTop: 25, paddingTop: 25, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  includeItem: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, paddingTop: 25, borderTopWidth: 1, borderTopColor: colors.cardBorder, marginBottom: 25 },
  priceLabel: { fontSize: 16, color: colors.textSecondary },
  price: { fontSize: 32, fontWeight: '700', color: colors.primary },
  backButton: { marginTop: spacing.md },
});

export default EventDetailScreen;



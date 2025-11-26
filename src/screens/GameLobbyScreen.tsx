/**
 * GameLobbyScreen - Pre-game lobby where players wait
 * Matches the HTML prototype lobby screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, withRepeat, withTiming } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Card } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';

interface Player {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
}

interface GameLobbyScreenProps {
  players: Player[];
  onGameStart: () => void;
}

const MOCK_PLAYERS: Player[] = [
  { id: '1', name: 'Sarah', avatar: '👩', gender: 'female' },
  { id: '2', name: 'Mike', avatar: '👨', gender: 'male' },
  { id: '3', name: 'Emma', avatar: '👩‍🦰', gender: 'female' },
  { id: '4', name: 'Jake', avatar: '🧔', gender: 'male' },
  { id: '5', name: 'Lily', avatar: '👱‍♀️', gender: 'female' },
  { id: '6', name: 'Alex', avatar: '👨‍🦱', gender: 'male' },
];

const PlayerAvatar: React.FC<{ player: Player; delay: number }> = ({ player, delay }) => {
  const gradientColors = player.gender === 'female' 
    ? [colors.primary, colors.primaryLight] 
    : [colors.maleGradientStart, colors.maleGradientEnd];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.playerContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.avatarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatarEmoji}>{player.avatar}</Text>
      </LinearGradient>
      <Text style={styles.playerName}>{player.name}</Text>
    </Animated.View>
  );
};

export const GameLobbyScreen: React.FC<GameLobbyScreenProps> = ({
  players = MOCK_PLAYERS,
  onGameStart,
}) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onGameStart]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withTiming(0.5, { duration: 1000 }), -1, true),
  }));

  return (
    <GradientBackground variant="intense">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <Text style={styles.title}>Game Night Lobby</Text>
            <Text style={styles.subtitle}>Your group is ready!</Text>
          </Animated.View>

          {/* Countdown */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <Card variant="elevated" style={styles.countdownCard}>
              <Text style={styles.countdownLabel}>Games start in</Text>
              <Text style={styles.countdown}>{countdown}</Text>
              <Text style={styles.countdownUnit}>seconds</Text>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
            </Card>
          </Animated.View>

          {/* Players Grid */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Card variant="subtle" style={styles.playersCard}>
              <Text style={styles.playersTitle}>Tonight's Players</Text>
              <View style={styles.playersGrid}>
                {players.map((player, index) => (
                  <PlayerAvatar key={player.id} player={player} delay={500 + index * 100} />
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Info */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🎮 7 games • ⏱️ ~90 minutes • 💕 Match at the end
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  countdownCard: { alignItems: 'center', paddingVertical: 30, marginBottom: 25, position: 'relative' },
  countdownLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  countdown: { fontSize: 72, fontWeight: '900', color: colors.primary, textShadowColor: 'rgba(255, 20, 147, 0.5)', textShadowRadius: 20 },
  countdownUnit: { fontSize: 14, color: colors.textSecondary },
  pulseRing: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: colors.primary },
  playersCard: { paddingVertical: 25, marginBottom: 20 },
  playersTitle: { fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 20 },
  playersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  playerContainer: { alignItems: 'center', width: 80 },
  avatarGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarEmoji: { fontSize: 30 },
  playerName: { fontSize: 14, color: colors.text },
  infoContainer: { alignItems: 'center' },
  infoText: { fontSize: 14, color: colors.textSecondary },
});

export default GameLobbyScreen;



/**
 * GameSelectScreen - Select which game to play
 * Shows all 7 games in a sleek grid matching the prototype
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
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from '../shims/reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Logo, Icon, IconName } from '../components/common';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { HapticService } from '../services/haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 2 - spacing.md) / 2;

export type GameType = 'spark' | 'hottake' | 'twotruths' | 'never' | 'dare' | 'battle' | 'whosaid';

interface GameSelectScreenProps {
  onGameSelect: (game: GameType) => void;
  onBack?: () => void;
}

const GAMES: { id: GameType; title: string; icon: IconName; desc: string }[] = [
  { id: 'spark', title: 'Spark', icon: 'zap', desc: 'Quick chemistry test' },
  { id: 'hottake', title: 'Hot Take', icon: 'award', desc: 'Most likely to' },
  { id: 'twotruths', title: 'Two Truths', icon: 'eye', desc: 'Spot the lie' },
  { id: 'never', title: 'Never Have I', icon: 'heart', desc: 'Confessions' },
  { id: 'dare', title: 'Dare or Drink', icon: 'activity', desc: 'Take the risk' },
  { id: 'battle', title: 'Battle', icon: 'users', desc: 'Men vs Women' },
  { id: 'whosaid', title: 'Who Said It', icon: 'message-circle', desc: 'Guess who' },
];

const GameCard: React.FC<{
  game: typeof GAMES[0];
  onPress: () => void;
  delay: number;
}> = ({ game, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => {
        HapticService.light();
        onPress();
      }}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['rgba(255, 20, 147, 0.15)', 'rgba(255, 20, 147, 0.03)']}
        style={styles.gameCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconWrapper}>
          <Icon name={game.icon} size={32} color={colors.primary} />
        </View>
        <Text style={styles.gameTitle}>{game.title}</Text>
        <Text style={styles.gameDesc}>{game.desc}</Text>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

export const GameSelectScreen: React.FC<GameSelectScreenProps> = ({
  onGameSelect,
  onBack,
}) => {
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
            <Text style={styles.subtitle}>Choose Your Game</Text>
          </View>

          {/* Games Grid */}
          <View style={styles.gamesGrid}>
            {GAMES.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                onPress={() => onGameSelect(game.id)}
                delay={index * 80}
              />
            ))}
          </View>

          {/* Info */}
          <Text style={styles.infoText}>
            Tap any game to play
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 30 },
  subtitle: { 
    color: colors.textSecondary, 
    marginTop: 12, 
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  gameCard: {
    width: CARD_WIDTH,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  gameCardGradient: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 20, 147, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  gameDesc: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 20,
    letterSpacing: 1,
  },
});

export default GameSelectScreen;

/**
 * GameSelectScreen - Select which game to play
 * Shows all 7 games in a grid
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientBackground, Card, Logo } from '../components/common';
import { colors, spacing, borderRadius } from '../theme';
import { HapticService } from '../services/haptics';

export type GameType = 'spark' | 'hottake' | 'twotruths' | 'never' | 'dare' | 'battle' | 'whosaid';

interface GameSelectScreenProps {
  onGameSelect: (game: GameType) => void;
  onBack: () => void;
}

const GAMES = [
  { id: 'spark' as GameType, title: 'Spark', icon: '⚡', desc: 'Deep questions' },
  { id: 'dare' as GameType, title: 'Dare or Drink', icon: '🍸', desc: 'Bold dares' },
  { id: 'hottake' as GameType, title: 'Hot Take', icon: '🔥', desc: 'Most likely to' },
  { id: 'never' as GameType, title: 'Never Have I Ever', icon: '🙈', desc: 'Confessions' },
  { id: 'battle' as GameType, title: 'Battle of Sexes', icon: '⚔️', desc: 'Team trivia' },
  { id: 'whosaid' as GameType, title: 'Who Said It?', icon: '💬', desc: 'Guess the player' },
  { id: 'twotruths' as GameType, title: 'Two Truths & a Lie', icon: '🎭', desc: 'Spot the lie' },
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
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(255, 20, 147, 0.2)', 'rgba(255, 20, 147, 0.05)']}
        style={styles.gameCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.gameIcon}>{game.icon}</Text>
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
            Click any game to play →
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
  subtitle: { color: colors.textSecondary, marginTop: 10, fontSize: 15 },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gameCard: {
    width: '47%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  gameCardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },
  gameDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 14,
    marginTop: 25,
  },
});

export default GameSelectScreen;


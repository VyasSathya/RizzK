/**
 * PlayerVoteCard - Card for voting on a player
 * Used in games like Hot Take, Who Said It, etc.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface PlayerVoteCardProps {
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  isSelected?: boolean;
  voteCount?: number;
  showVotes?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PlayerVoteCard: React.FC<PlayerVoteCardProps> = ({
  name,
  avatar,
  gender,
  isSelected = false,
  voteCount = 0,
  showVotes = false,
  onPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const gradientColors = gender === 'female'
    ? [colors.primary, colors.primaryLight]
    : [colors.maleGradientStart, colors.maleGradientEnd];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    HapticService.light();
    scale.value = withSpring(0.95, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        animatedStyle,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.avatar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.avatarText}>{avatar}</Text>
      </LinearGradient>
      <Text style={[styles.name, isSelected && styles.nameSelected]}>{name}</Text>
      
      {showVotes && voteCount > 0 && (
        <View style={styles.voteBadge}>
          <Text style={styles.voteCount}>{voteCount}</Text>
        </View>
      )}
      
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.glassBg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.lg,
    minWidth: 100,
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  nameSelected: {
    color: colors.primary,
  },
  voteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});

export default PlayerVoteCard;


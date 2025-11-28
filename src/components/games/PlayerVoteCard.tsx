/**
 * PlayerVoteCard - Card for voting on a player
 * Used in games like Hot Take, Who Said It, etc.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from '../../shims/reanimated';
import { Avatar, Icon } from '../common';
import { colors, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface PlayerVoteCardProps {
  name: string;
  gender?: 'male' | 'female';
  isSelected?: boolean;
  voteCount?: number;
  showVotes?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PlayerVoteCard: React.FC<PlayerVoteCardProps> = ({
  name,
  gender,
  isSelected = false,
  voteCount = 0,
  showVotes = false,
  onPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

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
      <Avatar name={name} size={50} gender={gender} />
      <Text style={[styles.name, isSelected && styles.nameSelected]}>{name}</Text>

      {showVotes && voteCount > 0 && (
        <View style={styles.voteBadge}>
          <Text style={styles.voteCount}>{voteCount}</Text>
        </View>
      )}

      {isSelected && (
        <View style={styles.checkmark}>
          <Icon name="check" size={14} color="#fff" />
        </View>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    minWidth: 90,
    position: 'relative',
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 10,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primary,
  },
  voteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayerVoteCard;

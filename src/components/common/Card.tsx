/**
 * Card - Glass morphism card with pink border glow
 * Matches the HTML prototype container style exactly
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from '../../shims/reanimated';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { HapticService } from '../../services/haptics';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'subtle' | 'glass';
  onPress?: () => void;
  haptic?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  haptic = true,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    if (!onPress) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(3, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (!onPress) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!onPress) return;
    if (haptic) HapticService.light();
    onPress();
  };

  const variantStyles = {
    default: styles.defaultCard,
    elevated: styles.elevatedCard,
    subtle: styles.subtleCard,
    glass: styles.glassCard,
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={[
          styles.card,
          variantStyles[variant],
          animatedStyle,
          style,
        ]}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  defaultCard: {
    ...shadows.card,
  },
  elevatedCard: {
    ...shadows.glowIntense,
    borderColor: colors.cardBorderHover,
  },
  subtleCard: {
    backgroundColor: colors.glassBg,
    ...shadows.glow,
  },
  glassCard: {
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(40px)',
    ...shadows.glowIntense,
  },
});

export default Card;

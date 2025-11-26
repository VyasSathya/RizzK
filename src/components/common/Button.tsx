/**
 * Button - Premium gradient button with glow effect
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from '../../shims/reanimated';
import { colors, spacing, borderRadius, shadows, fonts } from '../../theme';
import { HapticService, HapticType } from '../../services/haptics';

interface ButtonProps { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; size?: 'small' | 'medium' | 'large'; disabled?: boolean; style?: ViewStyle; textStyle?: TextStyle; haptic?: HapticType; icon?: React.ReactNode; }

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'medium', disabled = false, style, textStyle, haptic = 'light', icon }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateY: translateY.value }] }));

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 15, stiffness: 400 }); translateY.value = withSpring(2, { damping: 15, stiffness: 400 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); translateY.value = withSpring(0, { damping: 15, stiffness: 400 }); };
  const handlePress = () => { if (disabled) return; HapticService[haptic](); onPress(); };

  const sizeStyles = { small: { paddingVertical: 10, paddingHorizontal: 20 }, medium: { paddingVertical: 16, paddingHorizontal: 32 }, large: { paddingVertical: 20, paddingHorizontal: 40 } };
  const textSizes = { small: 14, medium: 16, large: 18 };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9} disabled={disabled} style={[animatedStyle, disabled && styles.disabled, style]}>
        <LinearGradient colors={['#ff1493', '#ff69b4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.primaryButton, sizeStyles[size], styles.glowShadow]}>
          {icon}
          <Text style={[styles.primaryText, { fontSize: textSizes[size] }, textStyle]}>{title}</Text>
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  const variantStyles = { secondary: styles.secondaryButton, outline: styles.outlineButton, ghost: styles.ghostButton };
  const variantTextStyles = { secondary: styles.secondaryText, outline: styles.outlineText, ghost: styles.ghostText };

  return (
    <AnimatedTouchable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.8} disabled={disabled} style={[variantStyles[variant], sizeStyles[size], animatedStyle, disabled && styles.disabled, style]}>
      {icon}
      <Text style={[variantTextStyles[variant], { fontSize: textSizes[size] }, textStyle]}>{title}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  primaryButton: { borderRadius: borderRadius.round, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  glowShadow: { shadowColor: '#ff1493', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 15 },
  primaryText: { color: '#ffffff', fontFamily: fonts.bodySemiBold, letterSpacing: 1 },
  secondaryButton: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: borderRadius.round, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  secondaryText: { color: '#ffffff', fontFamily: fonts.bodySemiBold, letterSpacing: 1 },
  outlineButton: { backgroundColor: 'transparent', borderRadius: borderRadius.round, borderWidth: 2, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  outlineText: { color: colors.primary, fontFamily: fonts.bodySemiBold, letterSpacing: 1 },
  ghostButton: { backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  ghostText: { color: colors.textSecondary, fontFamily: fonts.bodyMedium },
  disabled: { opacity: 0.5 },
});

export default Button;

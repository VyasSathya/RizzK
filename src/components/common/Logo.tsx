/**
 * Logo - RizzK logo with pink glow effect
 * Matches the HTML prototype header style
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '../../theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'large',
  animated = true,
  style,
}) => {
  const glowOpacity = useSharedValue(0.5);

  React.useEffect(() => {
    if (animated) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.5, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [animated]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    textShadowRadius: 20 + (glowOpacity.value * 20),
    opacity: 0.8 + (glowOpacity.value * 0.2),
  }));

  const sizes = {
    small: { fontSize: 28, letterSpacing: 2 },
    medium: { fontSize: 40, letterSpacing: 2.5 },
    large: { fontSize: 52, letterSpacing: 3 },
  };

  const taglineSizes = {
    small: 10,
    medium: 13,
    large: 16,
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text
        style={[
          styles.logo,
          sizes[size],
          animated && animatedGlowStyle,
        ]}
      >
        RizzK
      </Animated.Text>
    </View>
  );
};

interface LogoWithTaglineProps extends LogoProps {
  tagline?: string;
}

export const LogoWithTagline: React.FC<LogoWithTaglineProps> = ({
  size = 'large',
  animated = true,
  tagline = 'TAKE THE RIZK',
  style,
}) => {
  const taglineSizes = {
    small: 10,
    medium: 13,
    large: 16,
  };

  return (
    <View style={[styles.container, style]}>
      <Logo size={size} animated={animated} />
      <Text style={[styles.tagline, { fontSize: taglineSizes[size] }]}>
        {tagline}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: '900',
    color: colors.primary,
    textShadowColor: 'rgba(255, 20, 147, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    color: colors.text,
    fontWeight: '300',
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 10,
    opacity: 0.9,
  },
});

export default Logo;


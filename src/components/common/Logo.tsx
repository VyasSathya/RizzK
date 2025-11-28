/**
 * Logo - RizzK logo with pink glow effect
 * Matches the HTML prototype header style
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts } from '../../theme';

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
  const sizes = {
    small: { fontSize: 28, letterSpacing: 2 },
    medium: { fontSize: 40, letterSpacing: 2.5 },
    large: { fontSize: 52, letterSpacing: 3 },
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.logo, sizes[size]]}>
        RizzK
      </Text>
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
    fontFamily: 'Cinzel_700Bold',
    color: colors.primary,
    textShadowColor: 'rgba(255, 20, 147, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontFamily: 'Raleway_600SemiBold',
    color: colors.text,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 10,
    opacity: 0.9,
  },
});

export default Logo;




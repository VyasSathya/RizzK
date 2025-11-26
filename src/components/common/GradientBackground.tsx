/**
 * GradientBackground - Full screen gradient background with glow effect
 * Matches the HTML prototype's dark background with pink glow
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

const { width, height } = Dimensions.get('window');

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'subtle' | 'intense';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const glowIntensity = {
    default: { top: 0.25, bottom: 0.15 },
    subtle: { top: 0.15, bottom: 0.1 },
    intense: { top: 0.4, bottom: 0.3 },
  };

  return (
    <View style={[styles.container, style]}>
      {/* Base black background */}
      <View style={styles.baseBackground} />
      
      {/* Radial glow effect at top center */}
      <LinearGradient
        colors={[
          'rgba(255, 20, 147, ' + glowIntensity[variant].top + ')',
          'rgba(255, 20, 147, 0.1)',
          'transparent',
        ]}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.4, 1]}
      />

      {/* Subtle side glows */}
      <LinearGradient
        colors={['rgba(255, 20, 147, 0.1)', 'transparent']}
        style={styles.leftGlow}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255, 20, 147, 0.1)']}
        style={styles.rightGlow}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />

      {/* Bottom glow */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 20, 147, ' + glowIntensity[variant].bottom + ')',
        ]}
        style={styles.bottomGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  baseBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  leftGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.3,
    height: '100%',
  },
  rightGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.3,
    height: '100%',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default GradientBackground;

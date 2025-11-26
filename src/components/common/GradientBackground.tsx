/**
 * GradientBackground - Full screen gradient background with glow effect
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

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
  return (
    <View style={[styles.container, style]}>
      {/* Base black background */}
      <View style={styles.baseBackground} />
      
      {/* Pink glow at top */}
      <LinearGradient
        colors={[
          variant === 'intense' ? 'rgba(255, 20, 147, 0.4)' : 'rgba(255, 20, 147, 0.2)',
          'transparent',
        ]}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Pink glow at bottom */}
      <LinearGradient
        colors={[
          'transparent',
          variant === 'intense' ? 'rgba(255, 20, 147, 0.3)' : 'rgba(255, 20, 147, 0.15)',
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
    backgroundColor: colors.background,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default GradientBackground;


/**
 * RizzK Color Theme
 * Premium neon pink theme matching the HTML prototype
 */

export const colors = {
  // Primary colors
  background: '#000000',
  primary: '#ff1493',
  primaryLight: '#ff69b4',
  primaryDark: '#c41069',
  
  // Gender gradients
  maleGradientStart: '#00d4ff',
  maleGradientEnd: '#0096ff',
  femaleGradientStart: '#ff1493',
  femaleGradientEnd: '#ff69b4',
  
  // UI backgrounds - matching prototype exactly
  cardBg: 'rgba(10, 10, 10, 0.8)',
  cardBorder: 'rgba(255, 20, 147, 0.3)',
  cardBorderHover: 'rgba(255, 20, 147, 0.5)',
  glassBg: 'rgba(20, 20, 20, 0.6)',
  glassLight: 'rgba(30, 30, 30, 0.6)',
  
  // Selected states
  selectedBg: 'rgba(255, 20, 147, 0.2)',
  selectedBorder: '#ff1493',
  
  // Feedback colors - softer greens
  success: '#34c759',
  error: '#ff3b30',
  warning: '#ff9500',
  
  // Text colors
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  textMuted: 'rgba(255, 255, 255, 0.3)',
  
  // Shadows and glows
  shadowPrimary: 'rgba(255, 20, 147, 0.6)',
  shadowIntense: 'rgba(255, 20, 147, 0.8)',
  textGlow: 'rgba(255, 20, 147, 0.5)',
};

// Pre-defined gradient arrays for LinearGradient
export const gradients = {
  primary: [colors.primary, colors.primaryLight],
  male: [colors.maleGradientStart, colors.maleGradientEnd],
  female: [colors.femaleGradientStart, colors.femaleGradientEnd],
  card: ['rgba(255, 20, 147, 0.15)', 'rgba(255, 20, 147, 0.05)'],
  intense: ['rgba(255, 20, 147, 0.3)', 'rgba(0, 0, 0, 0.8)'],
};

/**
 * RizzK Color Theme
 * Neon Pink theme with gender-based gradients
 */

export const colors = {
  // Primary colors
  background: '#000000',
  primary: '#ff1493',      // Hot pink
  primaryLight: '#ff69b4', // Light pink
  
  // Gender colors
  female: {
    start: '#ff1493',
    end: '#ff69b4',
  },
  male: {
    start: '#00d4ff',
    end: '#0096ff',
  },
  
  // UI backgrounds
  cardBg: 'rgba(10, 10, 10, 0.8)',
  cardBorder: 'rgba(255, 20, 147, 0.3)',
  glassBg: 'rgba(20, 20, 20, 0.6)',
  
  // Feedback colors
  success: '#00ff00',
  error: '#ff0000',
  warning: '#ffaa00',
  
  // Text colors
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  
  // Glow effects
  glow: {
    primary: 'rgba(255, 20, 147, 0.6)',
    success: 'rgba(0, 255, 0, 0.6)',
    error: 'rgba(255, 0, 0, 0.6)',
  },
};


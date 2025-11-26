/**
 * RizzK Animation Service
 * Reusable animation configurations using react-native-reanimated
 */

import {
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

// Animation durations (ms)
export const DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Easing functions
export const EASING = {
  easeOut: Easing.out(Easing.cubic),
  easeIn: Easing.in(Easing.cubic),
  easeInOut: Easing.inOut(Easing.cubic),
  bounce: Easing.bounce,
};

// Spring configurations
export const SPRING_CONFIG = {
  light: {
    damping: 15,
    stiffness: 150,
  },
  medium: {
    damping: 20,
    stiffness: 200,
  },
  heavy: {
    damping: 25,
    stiffness: 250,
  },
};

/**
 * Fade In Animation
 */
export const fadeIn = (duration: number = DURATION.normal) => {
  return withTiming(1, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Fade Out Animation
 */
export const fadeOut = (duration: number = DURATION.normal) => {
  return withTiming(0, {
    duration,
    easing: EASING.easeIn,
  });
};

/**
 * Scale In Animation (pop in)
 */
export const scaleIn = (duration: number = DURATION.normal) => {
  return withSpring(1, SPRING_CONFIG.medium);
};

/**
 * Scale Out Animation
 */
export const scaleOut = (duration: number = DURATION.normal) => {
  return withTiming(0, {
    duration,
    easing: EASING.easeIn,
  });
};

/**
 * Slide Up Animation
 */
export const slideUp = (distance: number = 50, duration: number = DURATION.normal) => {
  return withTiming(-distance, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Slide Down Animation
 */
export const slideDown = (distance: number = 50, duration: number = DURATION.normal) => {
  return withTiming(distance, {
    duration,
    easing: EASING.easeOut,
  });
};

/**
 * Bounce Animation (for emphasis)
 */
export const bounce = () => {
  return withSequence(
    withTiming(1.1, { duration: 150 }),
    withTiming(0.95, { duration: 150 }),
    withTiming(1, { duration: 150 })
  );
};

/**
 * Shake Animation (for errors)
 */
export const shake = () => {
  return withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

/**
 * Pulse Animation (heartbeat)
 */
export const pulse = () => {
  return withRepeat(
    withSequence(
      withTiming(1.05, { duration: 400 }),
      withTiming(1, { duration: 400 })
    ),
    -1, // infinite
    false
  );
};

/**
 * Glow Animation (for highlights)
 */
export const glow = () => {
  return withRepeat(
    withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0.5, { duration: 1000 })
    ),
    -1, // infinite
    true // reverse
  );
};

/**
 * Button Press Animation
 */
export const buttonPress = () => {
  return withSequence(
    withTiming(0.95, { duration: 100 }),
    withSpring(1, SPRING_CONFIG.light)
  );
};


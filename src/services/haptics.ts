/**
 * RizzK Haptic Feedback Service
 * 2025 UX best practices - sleek, purposeful haptics
 */

import * as Haptics from 'expo-haptics';

export const HapticService = {
  /**
   * Light tap (10-20ms equivalent)
   * Use for: Button taps, screen transitions, light selections
   */
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Medium impact (20-30ms)
   * Use for: Confirmations, votes, ready-up actions
   */
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Heavy impact (30-50ms)
   * Use for: Errors, warnings, critical actions
   */
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /**
   * Success pattern (Light → Medium, 100ms apart)
   * Use for: Correct answers, mutual matches, successful submissions
   */
  success: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 100);
  },

  /**
   * Error pattern (Heavy x3, 50ms apart)
   * Use for: Wrong answers, failed actions, validation errors
   */
  error: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 50);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 100);
  },

  /**
   * Notification pattern (Medium → Light, 200ms apart)
   * Use for: New messages, player ready notifications, round transitions
   */
  notification: async () => {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  },

  /**
   * Selection feedback (iOS only - more refined)
   * Use for: Picker selections, slider adjustments
   */
  selection: () => {
    Haptics.selectionAsync();
  },
};


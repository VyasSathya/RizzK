/**
 * Input - Text input with pink border glow on focus
 * Matches the HTML prototype input style
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from '../../shims/reanimated';
import { colors, spacing, borderRadius } from '../../theme';
import { HapticService } from '../../services/haptics';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const glowOpacity = useSharedValue(0);
  const borderColorAnim = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
    borderColor: borderColorAnim.value === 1 
      ? colors.primary 
      : error 
        ? colors.error 
        : colors.cardBorder,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    glowOpacity.value = withTiming(0.3, { duration: 200 });
    borderColorAnim.value = withTiming(1, { duration: 200 });
    HapticService.selection();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    glowOpacity.value = withTiming(0, { duration: 200 });
    borderColorAnim.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <AnimatedView
        style={[
          styles.inputContainer,
          error && styles.inputError,
          animatedContainerStyle,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </AnimatedView>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    opacity: 0.9,
  },
  inputContainer: {
    backgroundColor: colors.glassBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 0,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default Input;




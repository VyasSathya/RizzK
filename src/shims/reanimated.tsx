// Shim for react-native-reanimated using standard React Native Animated API
// This allows the app to work in Expo Go without native reanimated

import { Animated as RNAnimated, Easing, ViewStyle, TextStyle, ImageStyle, View, Text, Image, ViewProps, TextProps, ImageProps } from 'react-native';
import React, { useRef, useEffect, useMemo } from 'react';

// Shared value shim
export function useSharedValue<T>(initialValue: T): { value: T } {
  const ref = useRef({ value: initialValue });
  return ref.current;
}

// Animated style shim - returns empty object
export function useAnimatedStyle(
  updater: () => ViewStyle | TextStyle | ImageStyle,
  deps?: readonly any[]
): ViewStyle | TextStyle | ImageStyle {
  return useMemo(() => updater(), deps || []);
}

// Spring animation shim
export function withSpring<T>(toValue: T, config?: any, callback?: (finished: boolean) => void): T {
  callback?.(true);
  return toValue;
}

// Timing animation shim
export function withTiming<T>(toValue: T, config?: any, callback?: (finished: boolean) => void): T {
  callback?.(true);
  return toValue;
}

// Repeat animation shim
export function withRepeat<T>(animation: T, numberOfReps?: number, reverse?: boolean, callback?: (finished: boolean) => void): T {
  callback?.(true);
  return animation;
}

// Sequence animation shim - returns last value
export function withSequence<T>(...animations: T[]): T {
  return animations[animations.length - 1];
}

// Delay animation shim
export function withDelay<T>(delayMs: number, animation: T): T {
  return animation;
}

// Animation presets (chainable)
const createAnimationPreset = (name: string) => {
  const preset = {
    duration: (ms: number) => preset,
    delay: (ms: number) => preset,
    springify: () => preset,
    damping: (val: number) => preset,
    stiffness: (val: number) => preset,
    _name: name,
  };
  return preset;
};

export const FadeIn = createAnimationPreset('FadeIn');
export const FadeInDown = createAnimationPreset('FadeInDown');
export const FadeInUp = createAnimationPreset('FadeInUp');
export const FadeInRight = createAnimationPreset('FadeInRight');
export const FadeInLeft = createAnimationPreset('FadeInLeft');
export const SlideInRight = createAnimationPreset('SlideInRight');
export const SlideInLeft = createAnimationPreset('SlideInLeft');
export const SlideOutLeft = createAnimationPreset('SlideOutLeft');
export const SlideOutRight = createAnimationPreset('SlideOutRight');
export const FadeOutLeft = createAnimationPreset('FadeOutLeft');
export const FadeOutRight = createAnimationPreset('FadeOutRight');
export const FadeOut = createAnimationPreset('FadeOut');

export const Layout = createAnimationPreset('Layout');

export { Easing };

// Animated View wrapper with fade-in effect
interface AnimatedViewProps extends ViewProps {
  entering?: any;
  exiting?: any;
  layout?: any;
}

const AnimatedViewComponent = React.forwardRef<View, AnimatedViewProps>(
  ({ entering, exiting, layout, style, children, ...props }, ref) => {
    const opacity = useRef(new RNAnimated.Value(0)).current;
    const translateY = useRef(new RNAnimated.Value(15)).current;

    useEffect(() => {
      RNAnimated.parallel([
        RNAnimated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <RNAnimated.View
        ref={ref as any}
        style={[
          style,
          { opacity, transform: [{ translateY }] },
        ]}
        {...props}
      >
        {children}
      </RNAnimated.View>
    );
  }
);

// Animated Text wrapper
interface AnimatedTextProps extends TextProps {
  entering?: any;
  exiting?: any;
  layout?: any;
}

const AnimatedTextComponent = React.forwardRef<Text, AnimatedTextProps>(
  ({ entering, exiting, layout, style, children, ...props }, ref) => {
    const opacity = useRef(new RNAnimated.Value(0)).current;

    useEffect(() => {
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <RNAnimated.Text ref={ref as any} style={[style, { opacity }]} {...props}>
        {children}
      </RNAnimated.Text>
    );
  }
);

// Animated Image wrapper
interface AnimatedImageProps extends ImageProps {
  entering?: any;
  exiting?: any;
  layout?: any;
}

const AnimatedImageComponent = React.forwardRef<Image, AnimatedImageProps>(
  ({ entering, exiting, layout, style, ...props }, ref) => {
    const opacity = useRef(new RNAnimated.Value(0)).current;

    useEffect(() => {
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <RNAnimated.Image ref={ref as any} style={[style, { opacity }]} {...props} />
    );
  }
);

// Create Animated object that mimics react-native-reanimated API
const Animated = {
  View: AnimatedViewComponent,
  Text: AnimatedTextComponent,
  Image: AnimatedImageComponent,
  ScrollView: RNAnimated.ScrollView,
  FlatList: RNAnimated.FlatList,
  Value: RNAnimated.Value,
  timing: RNAnimated.timing,
  spring: RNAnimated.spring,
  parallel: RNAnimated.parallel,
  sequence: RNAnimated.sequence,
  loop: RNAnimated.loop,
  event: RNAnimated.event,
  add: RNAnimated.add,
  subtract: RNAnimated.subtract,
  multiply: RNAnimated.multiply,
  divide: RNAnimated.divide,
  modulo: RNAnimated.modulo,
  createAnimatedComponent: RNAnimated.createAnimatedComponent,
};

export default Animated;

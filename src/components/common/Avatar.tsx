/**
 * Avatar - User avatar component with initials
 * Replaces emoji avatars with proper styled initials
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../theme';

interface AvatarProps {
  name: string;
  size?: number;
  gender?: 'male' | 'female';
}

const getInitials = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getAvatarColor = (name: string, gender?: 'male' | 'female'): string => {
  if (gender === 'female') {
    return 'rgba(255, 20, 147, 0.3)';
  }
  if (gender === 'male') {
    return 'rgba(100, 149, 237, 0.3)';
  }
  // Default based on name hash
  const hash = name.charCodeAt(0) % 2;
  return hash === 0 ? 'rgba(255, 20, 147, 0.3)' : 'rgba(100, 149, 237, 0.3)';
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  gender,
}) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name, gender);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  initials: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default Avatar;

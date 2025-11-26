/**
 * Icon - Feather icons wrapper for consistent iconography
 * Matches the HTML prototype which uses Feather Icons
 */

import React from 'react';
import {
  Zap,
  Heart,
  Users,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  Check,
  CheckCircle,
  X,
  Play,
  MessageCircle,
  Send,
  Plus,
  Info,
  Lock,
  Award,
  Activity,
  Eye,
  Coffee,
  Smartphone,
} from 'react-native-feather';
import { colors } from '../../theme';

export type IconName =
  | 'zap'
  | 'heart'
  | 'users'
  | 'calendar'
  | 'map-pin'
  | 'clock'
  | 'dollar-sign'
  | 'arrow-left'
  | 'check'
  | 'check-circle'
  | 'x'
  | 'play'
  | 'message-circle'
  | 'send'
  | 'plus'
  | 'info'
  | 'lock'
  | 'award'
  | 'activity'
  | 'eye'
  | 'coffee'
  | 'smartphone';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const iconMap: Record<IconName, React.ComponentType<any>> = {
  'zap': Zap,
  'heart': Heart,
  'users': Users,
  'calendar': Calendar,
  'map-pin': MapPin,
  'clock': Clock,
  'dollar-sign': DollarSign,
  'arrow-left': ArrowLeft,
  'check': Check,
  'check-circle': CheckCircle,
  'x': X,
  'play': Play,
  'message-circle': MessageCircle,
  'send': Send,
  'plus': Plus,
  'info': Info,
  'lock': Lock,
  'award': Award,
  'activity': Activity,
  'eye': Eye,
  'coffee': Coffee,
  'smartphone': Smartphone,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.primary,
  strokeWidth = 2,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(Icon "" not found);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;

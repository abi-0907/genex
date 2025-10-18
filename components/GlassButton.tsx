import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, shadows, borderRadius, typography } from '@/constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function GlassButton({ 
  title, 
  onPress, 
  variant = 'primary',
  style,
  textStyle,
  disabled = false
}: GlassButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return colors.glass.light;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.glass.medium;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return colors.primary;
    if (variant === 'primary') return '#FFFFFF';
    return colors.text.primary;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <BlurView intensity={variant === 'outline' ? 0 : 20} style={styles.blur}>
        <Text style={[
          styles.text,
          { 
            backgroundColor: getBackgroundColor(),
            opacity: disabled ? 0.5 : 1,
            color: getTextColor()
          },
          textStyle
        ]}>
          {title}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: borderRadius.md,
  },
  text: {
    ...typography.headline,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
});

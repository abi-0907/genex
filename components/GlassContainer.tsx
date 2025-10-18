import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, shadows, borderRadius } from '@/constants/theme';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderWidth?: number;
}

export function GlassContainer({ 
  children, 
  style, 
  intensity = 20,
  borderWidth = 1 
}: GlassContainerProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.blur}>
        <View style={[styles.content, { borderWidth }]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  content: {
    backgroundColor: colors.glass.medium,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
});

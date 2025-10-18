import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassContainer } from '@/components/GlassContainer';
import { GlassButton } from '@/components/GlassButton';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { Dna, BookOpen, Shield, ExternalLink } from 'lucide-react-native';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
      style={styles.gradient}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Rare Disease Triage</Text>
          <Text style={styles.subtitle}>Clinical decision support for rare diseases</Text>
        </View>

        <GlassContainer style={styles.section}>
          <View style={styles.iconHeader}>
            <Dna size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>About This App</Text>
          </View>
          <Text style={styles.bodyText}>
            This application assists clinicians in the diagnostic process for rare diseases by:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Mapping clinical observations to HPO terms</Text>
            <Text style={styles.bulletPoint}>• Ranking potential rare disease diagnoses</Text>
            <Text style={styles.bulletPoint}>• Providing evidence-based differential diagnoses</Text>
            <Text style={styles.bulletPoint}>• Supporting clinical decision-making</Text>
          </View>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.iconHeader}>
            <BookOpen size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>HPO Integration</Text>
          </View>
          <Text style={styles.bodyText}>
            The Human Phenotype Ontology (HPO) provides a standardized vocabulary of phenotypic abnormalities encountered in human disease. This app uses HPO terms to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Standardize clinical descriptions</Text>
            <Text style={styles.bulletPoint}>• Enable computational analysis</Text>
            <Text style={styles.bulletPoint}>• Improve diagnostic accuracy</Text>
          </View>
          <GlassButton
            title="Learn More About HPO"
            onPress={() => openLink('https://hpo.jax.org/')}
            variant="outline"
            style={styles.linkButton}
          />
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.iconHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Clinical Disclaimer</Text>
          </View>
          <Text style={styles.bodyText}>
            This application is intended for educational and research purposes only. It should not be used as the sole basis for clinical decision-making. Always consult with qualified healthcare professionals and use clinical judgment when diagnosing and treating patients.
          </Text>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourceList}>
            <GlassButton
              title="OMIM Database"
              onPress={() => openLink('https://www.omim.org/')}
              variant="outline"
              style={styles.resourceButton}
            />
            <GlassButton
              title="Orphanet"
              onPress={() => openLink('https://www.orpha.net/')}
              variant="outline"
              style={styles.resourceButton}
            />
            <GlassButton
              title="ClinVar"
              onPress={() => openLink('https://www.ncbi.nlm.nih.gov/clinvar/')}
              variant="outline"
              style={styles.resourceButton}
            />
          </View>
        </GlassContainer>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Built with ChatAndBuild</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.text.primary,
  },
  bodyText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  bulletList: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  bulletPoint: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  linkButton: {
    marginTop: spacing.md,
  },
  resourceList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  resourceButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

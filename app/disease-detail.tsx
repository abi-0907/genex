import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Dna, Users, BookOpen, CheckCircle } from 'lucide-react-native';
import { GlassContainer } from '@/components/GlassContainer';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { getDiseaseById } from '@/services/diseaseService';
import { getIntakeNoteById } from '@/services/storageService';

export default function DiseaseDetailScreen() {
  const router = useRouter();
  const { diseaseId, noteId } = useLocalSearchParams();
  
  const disease = getDiseaseById(diseaseId as string);
  const intakeNote = getIntakeNoteById(noteId as string);

  if (!disease) {
    return (
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
        style={styles.gradient}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Disease not found</Text>
        </View>
      </LinearGradient>
    );
  }

  const matchedHPOTerms = intakeNote?.hpoTerms?.filter(term => 
    disease.matchedHPOTerms.includes(term.id)
  ) || [];

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
          <Text style={styles.backText}>Back to Results</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{disease.name}</Text>
          <View style={styles.idRow}>
            <Text style={styles.diseaseId}>{disease.id}</Text>
            {disease.omimId && (
              <Text style={styles.diseaseId}>OMIM: {disease.omimId}</Text>
            )}
          </View>
        </View>

        <GlassContainer style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Match Score</Text>
          <Text style={styles.scoreValue}>{(disease.matchScore * 100).toFixed(0)}%</Text>
          <Text style={styles.scoreDescription}>
            Based on {matchedHPOTerms.length} matching phenotypic features
          </Text>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.bodyText}>{disease.description}</Text>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Epidemiology</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prevalence:</Text>
            <Text style={styles.infoValue}>{disease.prevalence}</Text>
          </View>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <Dna size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Genetics</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Inheritance:</Text>
            <View style={styles.tagContainer}>
              {disease.inheritance.map((pattern, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{pattern}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Associated Genes:</Text>
            <View style={styles.tagContainer}>
              {disease.genes.map((gene, index) => (
                <View key={index} style={[styles.tag, styles.geneTag]}>
                  <Text style={styles.tagText}>{gene}</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Matched HPO Terms</Text>
          </View>
          {matchedHPOTerms.length > 0 ? (
            matchedHPOTerms.map((term) => (
              <View key={term.id} style={styles.hpoItem}>
                <View style={styles.checkIcon}>
                  <CheckCircle size={16} color={colors.success} />
                </View>
                <View style={styles.hpoContent}>
                  <Text style={styles.hpoName}>{term.name}</Text>
                  <Text style={styles.hpoId}>{term.id}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No matching HPO terms</Text>
          )}
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical Evidence</Text>
          <View style={styles.evidenceItem}>
            <View style={[styles.evidenceBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.evidenceBadgeText}>Strong</Text>
            </View>
            <Text style={styles.evidenceText}>
              Multiple phenotypic features match known disease presentation
            </Text>
          </View>
          {disease.matchScore >= 0.7 && (
            <View style={styles.evidenceItem}>
              <View style={[styles.evidenceBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.evidenceBadgeText}>Strong</Text>
              </View>
              <Text style={styles.evidenceText}>
                High match score indicates strong phenotypic overlap
              </Text>
            </View>
          )}
          <View style={styles.evidenceItem}>
            <View style={[styles.evidenceBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.evidenceBadgeText}>Moderate</Text>
            </View>
            <Text style={styles.evidenceText}>
              Consider genetic testing for {disease.genes.join(', ')} genes
            </Text>
          </View>
        </GlassContainer>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This analysis is for educational purposes only. Clinical correlation and expert consultation are required for diagnosis.
          </Text>
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
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.body,
    color: colors.text.primary,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  idRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  diseaseId: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  scoreCard: {
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    ...typography.title1,
    fontSize: 48,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  scoreDescription: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
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
  },
  infoRow: {
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.secondary,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  geneTag: {
    backgroundColor: colors.secondary,
  },
  tagText: {
    ...typography.caption1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  hpoItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  checkIcon: {
    marginTop: 2,
  },
  hpoContent: {
    flex: 1,
  },
  hpoName: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  hpoId: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  evidenceItem: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  evidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  evidenceBadgeText: {
    ...typography.caption1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  evidenceText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  disclaimer: {
    backgroundColor: colors.glass.light,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  disclaimerText: {
    ...typography.caption1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.title3,
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

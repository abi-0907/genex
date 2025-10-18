import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, Activity, FileText } from 'lucide-react-native';
import { GlassContainer } from '@/components/GlassContainer';
import { GlassButton } from '@/components/GlassButton';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { getIntakeNoteById } from '@/services/storageService';

export default function ResultsScreen() {
  const router = useRouter();
  const { noteId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<'hpo' | 'diseases'>('hpo');
  
  const intakeNote = getIntakeNoteById(noteId as string);

  if (!intakeNote) {
    return (
      <LinearGradient
        colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
        style={styles.gradient}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Intake note not found</Text>
          <GlassButton title="Go Back" onPress={() => router.back()} />
        </View>
      </LinearGradient>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return colors.success;
    if (confidence >= 0.7) return colors.warning;
    return colors.error;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.7) return colors.success;
    if (score >= 0.4) return colors.warning;
    return colors.error;
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Analysis Results</Text>
          <Text style={styles.subtitle}>Patient: {intakeNote.patientId}</Text>
        </View>

        <GlassContainer style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Activity size={20} color={colors.primary} />
              <Text style={styles.summaryLabel}>HPO Terms</Text>
              <Text style={styles.summaryValue}>{intakeNote.hpoTerms?.length || 0}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={styles.summaryLabel}>Matches</Text>
              <Text style={styles.summaryValue}>{intakeNote.rankedDiseases?.length || 0}</Text>
            </View>
          </View>
        </GlassContainer>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'hpo' && styles.activeTab]}
            onPress={() => setSelectedTab('hpo')}
          >
            <Text style={[styles.tabText, selectedTab === 'hpo' && styles.activeTabText]}>
              HPO Terms
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'diseases' && styles.activeTab]}
            onPress={() => setSelectedTab('diseases')}
          >
            <Text style={[styles.tabText, selectedTab === 'diseases' && styles.activeTabText]}>
              Ranked Diseases
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'hpo' && (
          <View>
            {intakeNote.hpoTerms && intakeNote.hpoTerms.length > 0 ? (
              intakeNote.hpoTerms.map((term, index) => (
                <GlassContainer key={term.id} style={styles.termCard}>
                  <View style={styles.termHeader}>
                    <Text style={styles.termName}>{term.name}</Text>
                    <View style={[
                      styles.confidenceBadge,
                      { backgroundColor: getConfidenceColor(term.confidence) }
                    ]}>
                      <Text style={styles.confidenceText}>
                        {(term.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.termId}>{term.id}</Text>
                  <Text style={styles.termDefinition}>{term.definition}</Text>
                </GlassContainer>
              ))
            ) : (
              <GlassContainer style={styles.emptyCard}>
                <Text style={styles.emptyText}>No HPO terms identified</Text>
              </GlassContainer>
            )}
          </View>
        )}

        {selectedTab === 'diseases' && (
          <View>
            {intakeNote.rankedDiseases && intakeNote.rankedDiseases.length > 0 ? (
              intakeNote.rankedDiseases.map((disease, index) => (
                <TouchableOpacity
                  key={disease.id}
                  onPress={() => router.push({
                    pathname: '/disease-detail',
                    params: { diseaseId: disease.id, noteId: intakeNote.id },
                  })}
                  activeOpacity={0.7}
                >
                  <GlassContainer style={styles.diseaseCard}>
                    <View style={styles.diseaseHeader}>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                      </View>
                      <View style={styles.diseaseInfo}>
                        <Text style={styles.diseaseName}>{disease.name}</Text>
                        <Text style={styles.diseaseId}>{disease.id}</Text>
                      </View>
                    </View>

                    <View style={styles.matchScoreContainer}>
                      <Text style={styles.matchScoreLabel}>Match Score</Text>
                      <View style={styles.matchScoreBar}>
                        <View 
                          style={[
                            styles.matchScoreFill,
                            { 
                              width: `${disease.matchScore * 100}%`,
                              backgroundColor: getMatchScoreColor(disease.matchScore)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[
                        styles.matchScoreText,
                        { color: getMatchScoreColor(disease.matchScore) }
                      ]}>
                        {(disease.matchScore * 100).toFixed(0)}%
                      </Text>
                    </View>

                    <Text style={styles.diseaseDescription} numberOfLines={3}>
                      {disease.description}
                    </Text>

                    <View style={styles.diseaseFooter}>
                      <Text style={styles.prevalenceText}>
                        Prevalence: {disease.prevalence}
                      </Text>
                      <Text style={styles.viewDetailsText}>View Details →</Text>
                    </View>
                  </GlassContainer>
                </TouchableOpacity>
              ))
            ) : (
              <GlassContainer style={styles.emptyCard}>
                <Text style={styles.emptyText}>No disease matches found</Text>
              </GlassContainer>
            )}
          </View>
        )}

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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  summaryValue: {
    ...typography.title2,
    color: colors.text.primary,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border.light,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.glass.light,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.glass.heavy,
  },
  tabText: {
    ...typography.headline,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.primary,
  },
  termCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  termName: {
    ...typography.headline,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  confidenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  confidenceText: {
    ...typography.caption1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  termId: {
    ...typography.caption1,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  termDefinition: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  diseaseCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  rankBadge: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...typography.headline,
    color: colors.text.primary,
    fontWeight: '700',
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  diseaseId: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  matchScoreContainer: {
    marginBottom: spacing.md,
  },
  matchScoreLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  matchScoreBar: {
    height: 8,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  matchScoreFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  matchScoreText: {
    ...typography.caption1,
    fontWeight: '600',
  },
  diseaseDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  diseaseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevalenceText: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  viewDetailsText: {
    ...typography.caption1,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
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
    marginBottom: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

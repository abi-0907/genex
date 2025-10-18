import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Calendar, User } from 'lucide-react-native';
import { GlassContainer } from '@/components/GlassContainer';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { getIntakeNotes } from '@/services/storageService';

export default function HistoryScreen() {
  const router = useRouter();
  const intakeNotes = getIntakeNotes();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleNotePress = (noteId: string) => {
    router.push({
      pathname: '/results',
      params: { noteId },
    });
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
          <Text style={styles.title}>Patient History</Text>
          <Text style={styles.subtitle}>
            {intakeNotes.length} {intakeNotes.length === 1 ? 'case' : 'cases'} recorded
          </Text>
        </View>

        {intakeNotes.length === 0 ? (
          <GlassContainer style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No intake notes yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first patient intake to begin rare disease triage
            </Text>
          </GlassContainer>
        ) : (
          intakeNotes.map((note) => (
            <TouchableOpacity
              key={note.id}
              onPress={() => handleNotePress(note.id)}
              activeOpacity={0.7}
            >
              <GlassContainer style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.patientInfo}>
                    <User size={20} color={colors.primary} />
                    <Text style={styles.patientId}>{note.patientId}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.text.tertiary} />
                </View>

                <Text style={styles.chiefComplaint} numberOfLines={2}>
                  {note.chiefComplaint}
                </Text>

                <View style={styles.noteFooter}>
                  <View style={styles.dateContainer}>
                    <Calendar size={14} color={colors.text.tertiary} />
                    <Text style={styles.dateText}>{formatDate(note.timestamp)}</Text>
                  </View>
                  {note.rankedDiseases && note.rankedDiseases.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {note.rankedDiseases.length} matches
                      </Text>
                    </View>
                  )}
                </View>
              </GlassContainer>
            </TouchableOpacity>
          ))
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
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  noteCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  patientId: {
    ...typography.headline,
    color: colors.text.primary,
  },
  chiefComplaint: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption1,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

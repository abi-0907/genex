import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GlassContainer } from '@/components/GlassContainer';
import { GlassButton } from '@/components/GlassButton';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { extractHPOTerms } from '@/services/hpoService';
import { rankDiseases } from '@/services/diseaseService';
import { saveIntakeNote } from '@/services/storageService';
import { IntakeNote } from '@/types';

export default function NewIntakeScreen() {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = () => {
    if (!patientId || !chiefComplaint || !symptoms) {
      alert('Please fill in Patient ID, Chief Complaint, and Symptoms');
      return;
    }

    setIsProcessing(true);

    // Combine all text for HPO extraction
    const fullText = `${chiefComplaint} ${symptoms} ${medicalHistory} ${familyHistory} ${physicalExam}`;
    
    // Extract HPO terms
    const hpoTerms = extractHPOTerms(fullText);
    
    // Rank diseases
    const rankedDiseases = rankDiseases(hpoTerms);

    // Create intake note
    const intakeNote: IntakeNote = {
      id: Date.now().toString(),
      patientId,
      timestamp: new Date(),
      chiefComplaint,
      symptoms,
      medicalHistory,
      familyHistory,
      physicalExam,
      hpoTerms,
      rankedDiseases,
    };

    // Save note
    saveIntakeNote(intakeNote);

    setIsProcessing(false);

    // Navigate to results
    router.push({
      pathname: '/results',
      params: { noteId: intakeNote.id },
    });
  };

  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>New Patient Intake</Text>
            <Text style={styles.subtitle}>Enter clinical information for rare disease triage</Text>
          </View>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Patient ID *</Text>
            <TextInput
              style={styles.input}
              value={patientId}
              onChangeText={setPatientId}
              placeholder="Enter patient identifier"
              placeholderTextColor={colors.text.tertiary}
            />
          </GlassContainer>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Chief Complaint *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
              placeholder="Primary reason for visit"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
          </GlassContainer>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Symptoms & Presentation *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Describe symptoms, onset, duration, severity..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={5}
            />
          </GlassContainer>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              placeholder="Past medical conditions, surgeries, medications..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
            />
          </GlassContainer>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Family History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={familyHistory}
              onChangeText={setFamilyHistory}
              placeholder="Genetic conditions, consanguinity, affected relatives..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
            />
          </GlassContainer>

          <GlassContainer style={styles.section}>
            <Text style={styles.label}>Physical Examination</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={physicalExam}
              onChangeText={setPhysicalExam}
              placeholder="Physical findings, measurements, observations..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
            />
          </GlassContainer>

          <GlassButton
            title={isProcessing ? "Processing..." : "Analyze & Generate Report"}
            onPress={handleAnalyze}
            disabled={isProcessing}
            style={styles.analyzeButton}
          />

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  label: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    marginTop: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

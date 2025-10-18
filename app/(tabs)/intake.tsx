import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, User, Stethoscope, Users, ClipboardList } from 'lucide-react-native';
import { GlassContainer } from '@/components/GlassContainer';
import { GlassButton } from '@/components/GlassButton';
import { extractHPOTerms } from '@/services/hpoService';
import { rankDiseases } from '@/services/diseaseService';
import { saveIntakeNote } from '@/services/storageService';
import { IntakeNote } from '@/types';

export default function IntakeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');

  const handleSubmit = async () => {
    if (!patientId.trim()) {
      Alert.alert('Error', 'Please enter a patient ID');
      return;
    }

    if (!symptoms.trim() && !chiefComplaint.trim()) {
      Alert.alert('Error', 'Please enter symptoms or chief complaint');
      return;
    }

    setLoading(true);

    try {
      // Combine all text for HPO extraction
      const combinedText = `${chiefComplaint} ${symptoms} ${medicalHistory} ${familyHistory} ${physicalExam}`;
      
      // Extract HPO terms
      const hpoTerms = await extractHPOTerms(combinedText);
      
      // Rank diseases
      const rankedDiseases = await rankDiseases(hpoTerms);

      // Create intake note
      const intakeNote: IntakeNote = {
        id: Date.now().toString(),
        patientId: patientId.trim(),
        timestamp: new Date(),
        chiefComplaint: chiefComplaint.trim(),
        symptoms: symptoms.trim(),
        medicalHistory: medicalHistory.trim(),
        familyHistory: familyHistory.trim(),
        physicalExam: physicalExam.trim(),
        hpoTerms,
        rankedDiseases,
      };

      // Save to storage
      await saveIntakeNote(intakeNote);

      // Navigate to results
      router.push({
        pathname: '/results',
        params: { noteId: intakeNote.id },
      });

      // Clear form
      setPatientId('');
      setChiefComplaint('');
      setSymptoms('');
      setMedicalHistory('');
      setFamilyHistory('');
      setPhysicalExam('');
    } catch (error) {
      console.error('Error processing intake:', error);
      Alert.alert('Error', 'Failed to process intake note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <FileText size={32} color="#007AFF" />
        <Text style={styles.title}>Patient Intake</Text>
        <Text style={styles.subtitle}>Enter patient information for rare disease triage</Text>
      </View>

      <GlassContainer style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <User size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Patient ID *</Text>
          </View>
          <TextInput
            style={styles.input}
            value={patientId}
            onChangeText={setPatientId}
            placeholder="Enter patient identifier"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <ClipboardList size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Chief Complaint</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={chiefComplaint}
            onChangeText={setChiefComplaint}
            placeholder="Primary reason for visit"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <Stethoscope size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Symptoms *</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={symptoms}
            onChangeText={setSymptoms}
            placeholder="Describe observed symptoms and phenotypes"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <FileText size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Medical History</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={medicalHistory}
            onChangeText={setMedicalHistory}
            placeholder="Past medical conditions, surgeries, medications"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <Users size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Family History</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={familyHistory}
            onChangeText={setFamilyHistory}
            placeholder="Relevant family medical history"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputHeader}>
            <Stethoscope size={20} color="#007AFF" />
            <Text style={styles.inputLabel}>Physical Examination</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={physicalExam}
            onChangeText={setPhysicalExam}
            placeholder="Physical examination findings"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            multiline
            numberOfLines={4}
          />
        </View>

        <GlassButton
          title={loading ? 'Processing...' : 'Analyze & Generate Report'}
          onPress={handleSubmit}
          disabled={loading}
          icon={loading ? <ActivityIndicator color="#fff" /> : undefined}
        />
      </GlassContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

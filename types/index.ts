export interface HPOTerm {
  id: string;
  name: string;
  definition: string;
  confidence: number;
}

export interface Disease {
  id: string;
  name: string;
  omimId?: string;
  prevalence: string;
  matchScore: number;
  matchedHPOTerms: string[];
  description: string;
  inheritance: string[];
  genes: string[];
}

export interface IntakeNote {
  id: string;
  patientId: string;
  timestamp: Date;
  chiefComplaint: string;
  symptoms: string;
  medicalHistory: string;
  familyHistory: string;
  physicalExam: string;
  hpoTerms?: HPOTerm[];
  rankedDiseases?: Disease[];
}

export interface Evidence {
  type: 'symptom' | 'lab' | 'imaging' | 'genetic' | 'family_history';
  description: string;
  hpoTerms: string[];
  strength: 'strong' | 'moderate' | 'weak';
}

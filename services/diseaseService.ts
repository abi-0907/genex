import { Disease, HPOTerm } from '@/types';
import { loadPhenotypeData } from './csvDataLoader';

let diseasesCache: Disease[] | null = null;

async function ensureDataLoaded() {
  if (!diseasesCache) {
    const { diseases } = await loadPhenotypeData();
    diseasesCache = diseases;
  }
}

export async function rankDiseases(hpoTerms: HPOTerm[]): Promise<Disease[]> {
  await ensureDataLoaded();
  
  const hpoIds = new Set(hpoTerms.map(term => term.id));
  
  // Calculate match scores
  const rankedDiseases = diseasesCache!.map(disease => {
    const matchedTerms = disease.matchedHPOTerms.filter(termId => hpoIds.has(termId));
    const matchScore = disease.matchedHPOTerms.length > 0 
      ? matchedTerms.length / disease.matchedHPOTerms.length 
      : 0;
    
    return {
      ...disease,
      matchScore,
    };
  });
  
  // Sort by match score
  return rankedDiseases
    .filter(disease => disease.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export async function getDiseaseById(id: string): Promise<Disease | undefined> {
  await ensureDataLoaded();
  return diseasesCache!.find(disease => disease.id === id);
}

export async function getAllDiseases(): Promise<Disease[]> {
  await ensureDataLoaded();
  return diseasesCache!;
}

export async function searchDiseases(query: string): Promise<Disease[]> {
  await ensureDataLoaded();
  
  const lowerQuery = query.toLowerCase();
  return diseasesCache!.filter(disease => 
    disease.name.toLowerCase().includes(lowerQuery) ||
    disease.id.toLowerCase().includes(lowerQuery)
  );
}

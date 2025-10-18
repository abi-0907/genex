import Papa from 'papaparse';
import { Disease, HPOTerm } from '@/types';

interface CSVRow {
  disease_id: string;
  disease_name: string;
  hpo_id: string;
  hpo_name: string;
}

let diseasesCache: Disease[] | null = null;
let hpoTermsCache: Map<string, HPOTerm> | null = null;

export async function loadPhenotypeData(): Promise<{ diseases: Disease[], hpoTerms: Map<string, HPOTerm> }> {
  if (diseasesCache && hpoTermsCache) {
    return { diseases: diseasesCache, hpoTerms: hpoTermsCache };
  }

  try {
    const csvData = require('../assets/data/diseasephenotype.csv');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as CSVRow[];
          
          // Build disease map
          const diseaseMap = new Map<string, Disease>();
          const hpoMap = new Map<string, HPOTerm>();
          
          rows.forEach(row => {
            // Add HPO term to map
            if (!hpoMap.has(row.hpo_id)) {
              hpoMap.set(row.hpo_id, {
                id: row.hpo_id,
                name: row.hpo_name,
                definition: '', // CSV doesn't include definitions
                confidence: 0.9, // Default confidence
              });
            }
            
            // Add or update disease
            if (!diseaseMap.has(row.disease_id)) {
              diseaseMap.set(row.disease_id, {
                id: row.disease_id,
                name: row.disease_name,
                prevalence: 'Unknown',
                matchScore: 0,
                matchedHPOTerms: [row.hpo_id],
                description: `Rare disease characterized by multiple phenotypic features.`,
                inheritance: [],
                genes: [],
              });
            } else {
              const disease = diseaseMap.get(row.disease_id)!;
              if (!disease.matchedHPOTerms.includes(row.hpo_id)) {
                disease.matchedHPOTerms.push(row.hpo_id);
              }
            }
          });
          
          diseasesCache = Array.from(diseaseMap.values());
          hpoTermsCache = hpoMap;
          
          resolve({ diseases: diseasesCache, hpoTerms: hpoTermsCache });
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading phenotype data:', error);
    throw error;
  }
}

export function clearCache() {
  diseasesCache = null;
  hpoTermsCache = null;
}

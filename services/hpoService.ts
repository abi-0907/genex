import { HPOTerm } from '@/types';
import { loadPhenotypeData } from './csvDataLoader';

let hpoTermsMap: Map<string, HPOTerm> | null = null;

async function ensureDataLoaded() {
  if (!hpoTermsMap) {
    const { hpoTerms } = await loadPhenotypeData();
    hpoTermsMap = hpoTerms;
  }
}

export async function extractHPOTerms(text: string): Promise<HPOTerm[]> {
  await ensureDataLoaded();
  
  const lowerText = text.toLowerCase();
  const foundTerms: HPOTerm[] = [];
  
  // Search for HPO term names in the text
  hpoTermsMap!.forEach((term) => {
    const termNameLower = term.name.toLowerCase();
    
    // Check for exact matches or partial matches
    if (lowerText.includes(termNameLower)) {
      foundTerms.push({
        ...term,
        confidence: 0.95, // High confidence for exact matches
      });
    } else {
      // Check for keyword matches
      const keywords = termNameLower.split(' ');
      const matchCount = keywords.filter(keyword => 
        keyword.length > 3 && lowerText.includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        const confidence = Math.min(0.9, matchCount / keywords.length);
        if (confidence > 0.5) {
          foundTerms.push({
            ...term,
            confidence,
          });
        }
      }
    }
  });
  
  // Remove duplicates and sort by confidence
  const uniqueTerms = Array.from(
    new Map(foundTerms.map(term => [term.id, term])).values()
  ).sort((a, b) => b.confidence - a.confidence);
  
  return uniqueTerms;
}

export async function searchHPOTerms(query: string): Promise<HPOTerm[]> {
  await ensureDataLoaded();
  
  const lowerQuery = query.toLowerCase();
  const results: HPOTerm[] = [];
  
  hpoTermsMap!.forEach((term) => {
    const termNameLower = term.name.toLowerCase();
    
    if (termNameLower.includes(lowerQuery) || term.id.toLowerCase().includes(lowerQuery)) {
      results.push(term);
    }
  });
  
  return results.sort((a, b) => b.confidence - a.confidence);
}

export async function getHPOTermById(id: string): Promise<HPOTerm | undefined> {
  await ensureDataLoaded();
  return hpoTermsMap!.get(id);
}

export async function getAllHPOTerms(): Promise<HPOTerm[]> {
  await ensureDataLoaded();
  return Array.from(hpoTermsMap!.values());
}

import { Disease, HPOTerm } from '@/types';

let diseasesCache: Disease[] | null = null;
let hpoTermsCache: Map<string, HPOTerm> | null = null;

// Mock data to bypass CSV loading
const MOCK_DATA = {
  diseases: [
    {
      id: 'ORPHA:558',
      name: 'Marfan syndrome',
      prevalence: '1-5 / 10 000',
      matchScore: 0,
      matchedHPOTerms: ['HP:0001166', 'HP:0001519', 'HP:0000545'],
      description: 'A genetic disorder affecting connective tissue characterized by tall stature, long limbs, and cardiovascular issues.',
      inheritance: ['Autosomal dominant'],
      genes: ['FBN1'],
    },
    {
      id: 'ORPHA:710',
      name: 'Ehlers-Danlos syndrome',
      prevalence: '1-9 / 100 000',
      matchScore: 0,
      matchedHPOTerms: ['HP:0000974', 'HP:0001382', 'HP:0002829'],
      description: 'A group of disorders affecting connective tissues supporting the skin, bones, blood vessels, and other organs.',
      inheritance: ['Autosomal dominant', 'Autosomal recessive'],
      genes: ['COL5A1', 'COL5A2', 'COL3A1'],
    },
    {
      id: 'ORPHA:536',
      name: 'Osteogenesis imperfecta',
      prevalence: '1-9 / 100 000',
      matchScore: 0,
      matchedHPOTerms: ['HP:0000939', 'HP:0000592', 'HP:0000767'],
      description: 'A genetic disorder characterized by bones that break easily, often with little or no apparent cause.',
      inheritance: ['Autosomal dominant', 'Autosomal recessive'],
      genes: ['COL1A1', 'COL1A2'],
    },
  ],
  hpoTerms: new Map<string, HPOTerm>([
    ['HP:0001166', { id: 'HP:0001166', name: 'Arachnodactyly', definition: 'Abnormally long and slender fingers', confidence: 0.9 }],
    ['HP:0001519', { id: 'HP:0001519', name: 'Disproportionate tall stature', definition: 'Tall stature with disproportionate body segments', confidence: 0.9 }],
    ['HP:0000545', { id: 'HP:0000545', name: 'Myopia', definition: 'Nearsightedness', confidence: 0.85 }],
    ['HP:0000974', { id: 'HP:0000974', name: 'Hyperextensible skin', definition: 'Skin that can be stretched beyond normal', confidence: 0.9 }],
    ['HP:0001382', { id: 'HP:0001382', name: 'Joint hypermobility', definition: 'Joints that move beyond normal range', confidence: 0.9 }],
    ['HP:0002829', { id: 'HP:0002829', name: 'Arthralgia', definition: 'Joint pain', confidence: 0.8 }],
    ['HP:0000939', { id: 'HP:0000939', name: 'Osteoporosis', definition: 'Reduced bone mineral density', confidence: 0.9 }],
    ['HP:0000592', { id: 'HP:0000592', name: 'Blue sclerae', definition: 'Bluish coloration of the whites of the eyes', confidence: 0.95 }],
    ['HP:0000767', { id: 'HP:0000767', name: 'Pectus excavatum', definition: 'Sunken chest', confidence: 0.85 }],
  ]),
};

export async function loadPhenotypeData(): Promise<{ diseases: Disease[], hpoTerms: Map<string, HPOTerm> }> {
  if (diseasesCache && hpoTermsCache) {
    return { diseases: diseasesCache, hpoTerms: hpoTermsCache };
  }

  // Simulate async loading
  await new Promise(resolve => setTimeout(resolve, 100));

  diseasesCache = MOCK_DATA.diseases;
  hpoTermsCache = MOCK_DATA.hpoTerms;

  console.log(`Loaded ${diseasesCache.length} diseases and ${hpoTermsCache.size} HPO terms (mock data)`);

  return { diseases: diseasesCache, hpoTerms: hpoTermsCache };
}

export function clearCache() {
  diseasesCache = null;
  hpoTermsCache = null;
}

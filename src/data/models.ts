
export interface ElectoralDivision {
  id: string;
  name: string;
  county: string;
  population: number;
  coordinates: [number, number]; // [lat, lng]
  currentRisk: RiskAssessment;
  futureRisk: RiskAssessment;
}

export interface RiskAssessment {
  overall: number; // 0-100 score
  factors: RiskFactors;
}

export interface RiskFactors {
  dependencyRatio: number; // 0-100
  hospitalStress: number; // 0-100
  isolationScore: number; // 0-100
  walkability: number; // 0-100
  environmentalScore: number; // 0-100 (New factor)
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface ScenarioModifiers {
  dependencyRatioChange: number; // -100 to 100 (percentage change)
  hospitalStressChange: number; // -100 to 100
  isolationScoreChange: number; // -100 to 100
  walkabilityChange: number; // -100 to 100
  environmentalScoreChange: number; // -100 to 100 (New modifier)
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 25) return 'low';
  if (score < 50) return 'medium';
  if (score < 75) return 'high';
  return 'very-high';
}

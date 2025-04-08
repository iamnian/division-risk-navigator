import { RiskAssessment, RiskFactors, ScenarioModifiers } from "@/data/models";

// Calculate a modified risk assessment based on scenario modifiers
export function calculateScenarioRisk(
  baseRisk: RiskAssessment,
  modifiers: ScenarioModifiers
): RiskAssessment {
  // Apply modifiers to each factor
  const modifiedFactors: RiskFactors = {
    dependencyRatio: applyModifier(baseRisk.factors.dependencyRatio, modifiers.dependencyRatioChange),
    hospitalStress: applyModifier(baseRisk.factors.hospitalStress, modifiers.hospitalStressChange),
    isolationScore: applyModifier(baseRisk.factors.isolationScore, modifiers.isolationScoreChange),
    walkability: applyModifier(baseRisk.factors.walkability, modifiers.walkabilityChange),
  };

  // Calculate new overall score
  const overall = calculateOverallScore(modifiedFactors);

  return {
    overall,
    factors: modifiedFactors
  };
}

// Apply a percentage modifier to a value, keeping it within 0-100 range
function applyModifier(value: number, modifierPercentage: number): number {
  const change = value * (modifierPercentage / 100);
  const newValue = value + change;
  return Math.max(0, Math.min(100, newValue));
}

// Calculate overall risk score from factor values
export function calculateOverallScore(factors: RiskFactors): number {
  // Different weights for different factors
  const weights = {
    dependencyRatio: 0.3,
    hospitalStress: 0.3,
    isolationScore: 0.25,
    walkability: 0.15
  };

  // For walkability, a higher score is actually better, so we invert it
  const invertedWalkability = 100 - factors.walkability;

  const weightedScore = 
    factors.dependencyRatio * weights.dependencyRatio +
    factors.hospitalStress * weights.hospitalStress +
    factors.isolationScore * weights.isolationScore +
    invertedWalkability * weights.walkability;

  return Math.round(weightedScore);
}

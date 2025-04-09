
import { RiskAssessment, RiskFactors, ScenarioModifiers } from "@/data/models";

// Calculate a modified risk assessment based on scenario modifiers
export function calculateScenarioRisk(
  baseRisk: RiskAssessment,
  modifiers: ScenarioModifiers
): RiskAssessment {
  // Check if all modifiers are zero
  const allModifiersZero = Object.values(modifiers).every(val => val === 0);
  
  // If all modifiers are zero, return the base risk exactly as-is
  if (allModifiersZero) {
    return baseRisk;
  }
  
  // Apply modifiers to each factor
  const modifiedFactors: RiskFactors = {
    dependencyRatio: applyModifier(baseRisk.factors.dependencyRatio, modifiers.dependencyRatioChange),
    // Apply a 2.5x multiplier to hospital stress changes to make them more impactful
    hospitalStress: applyModifier(baseRisk.factors.hospitalStress, modifiers.hospitalStressChange * 2.5),
    isolationScore: applyModifier(baseRisk.factors.isolationScore, modifiers.isolationScoreChange),
    walkability: applyModifier(baseRisk.factors.walkability, modifiers.walkabilityChange),
    environmentalScore: applyModifier(baseRisk.factors.environmentalScore || 50, modifiers.environmentalScoreChange || 0),
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
  // Direct percentage change to ensure consistent behavior
  const change = value * (modifierPercentage / 100);
  const newValue = value + change;
  return Math.max(0, Math.min(100, newValue));
}

// Calculate overall risk score from factor values
export function calculateOverallScore(factors: RiskFactors): number {
  // Different weights for different factors
  const weights = {
    dependencyRatio: 0.25,
    // Increase hospital stress weight to have more impact on overall score
    hospitalStress: 0.35,
    isolationScore: 0.2,
    walkability: 0.1,
    environmentalScore: 0.1  // Reduced weight to balance the increased hospital stress weight
  };

  // For walkability, a higher score is actually better, so we invert it
  const invertedWalkability = 100 - factors.walkability;
  
  // For environmental score, higher is worse (more pollution/climate risk)
  const environmentalScore = factors.environmentalScore || 50; // Default to middle if not present

  const weightedScore = 
    factors.dependencyRatio * weights.dependencyRatio +
    factors.hospitalStress * weights.hospitalStress +
    factors.isolationScore * weights.isolationScore +
    invertedWalkability * weights.walkability +
    environmentalScore * weights.environmentalScore;

  return Math.round(weightedScore);
}

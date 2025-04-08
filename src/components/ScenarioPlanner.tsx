
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { ScenarioModifiers } from "@/data/models";
import { calculateScenarioRisk } from "@/utils/riskCalculator";

interface ScenarioPlannerProps {
  division: ElectoralDivision;
  viewMode: 'current' | 'future';
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({
  division,
  viewMode,
}) => {
  const baseRisk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
  
  const [modifiers, setModifiers] = useState<ScenarioModifiers>({
    dependencyRatioChange: 0,
    hospitalStressChange: 0,
    isolationScoreChange: 0,
    walkabilityChange: 0,
  });
  
  // Calculate the modified risk based on the current modifiers
  const modifiedRisk = calculateScenarioRisk(baseRisk, modifiers);
  const originalRiskLevel = getRiskLevel(baseRisk.overall);
  const modifiedRiskLevel = getRiskLevel(modifiedRisk.overall);
  
  // Handle slider changes
  const handleModifierChange = (
    modifierKey: keyof ScenarioModifiers, 
    value: number[]
  ) => {
    setModifiers({
      ...modifiers,
      [modifierKey]: value[0],
    });
  };

  // Reset all modifiers
  const handleReset = () => {
    setModifiers({
      dependencyRatioChange: 0,
      hospitalStressChange: 0,
      isolationScoreChange: 0,
      walkabilityChange: 0,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Dependency Ratio
                </label>
                <span className={modifiers.dependencyRatioChange > 0 ? "text-red-500" : 
                          modifiers.dependencyRatioChange < 0 ? "text-green-500" : ""}>
                  {modifiers.dependencyRatioChange > 0 ? "+" : ""}{modifiers.dependencyRatioChange}%
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-50}
                max={50}
                step={5}
                value={[modifiers.dependencyRatioChange]}
                onValueChange={(value) => handleModifierChange('dependencyRatioChange', value)}
                className="my-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Hospital Stress
                </label>
                <span className={modifiers.hospitalStressChange > 0 ? "text-red-500" : 
                          modifiers.hospitalStressChange < 0 ? "text-green-500" : ""}>
                  {modifiers.hospitalStressChange > 0 ? "+" : ""}{modifiers.hospitalStressChange}%
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-50}
                max={50}
                step={5}
                value={[modifiers.hospitalStressChange]}
                onValueChange={(value) => handleModifierChange('hospitalStressChange', value)}
                className="my-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Isolation Score
                </label>
                <span className={modifiers.isolationScoreChange > 0 ? "text-red-500" : 
                          modifiers.isolationScoreChange < 0 ? "text-green-500" : ""}>
                  {modifiers.isolationScoreChange > 0 ? "+" : ""}{modifiers.isolationScoreChange}%
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-50}
                max={50}
                step={5}
                value={[modifiers.isolationScoreChange]}
                onValueChange={(value) => handleModifierChange('isolationScoreChange', value)}
                className="my-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Walkability
                </label>
                <span className={modifiers.walkabilityChange > 0 ? "text-green-500" : 
                          modifiers.walkabilityChange < 0 ? "text-red-500" : ""}>
                  {modifiers.walkabilityChange > 0 ? "+" : ""}{modifiers.walkabilityChange}%
                </span>
              </div>
              <Slider
                defaultValue={[0]}
                min={-50}
                max={50}
                step={5}
                value={[modifiers.walkabilityChange]}
                onValueChange={(value) => handleModifierChange('walkabilityChange', value)}
                className="my-2"
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full mt-4"
            >
              Reset Modifiers
            </Button>
          </div>
          
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Risk Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Original Risk</div>
                  <div className={`text-3xl font-bold text-risk-${originalRiskLevel}`}>
                    {baseRisk.overall}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {originalRiskLevel.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Modified Risk</div>
                  <div className={`text-3xl font-bold text-risk-${modifiedRiskLevel}`}>
                    {modifiedRisk.overall}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {modifiedRiskLevel.replace('-', ' ')}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Factor Changes</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Dependency Ratio</span>
                    <span>{baseRisk.factors.dependencyRatio}% → {modifiedRisk.factors.dependencyRatio}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${modifiedRisk.factors.dependencyRatio}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Hospital Stress</span>
                    <span>{baseRisk.factors.hospitalStress}% → {modifiedRisk.factors.hospitalStress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${modifiedRisk.factors.hospitalStress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Isolation Score</span>
                    <span>{baseRisk.factors.isolationScore}% → {modifiedRisk.factors.isolationScore}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${modifiedRisk.factors.isolationScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Walkability</span>
                    <span>{baseRisk.factors.walkability}% → {modifiedRisk.factors.walkability}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${modifiedRisk.factors.walkability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioPlanner;

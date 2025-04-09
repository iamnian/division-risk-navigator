import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ElectoralDivision, RiskAssessment, ScenarioModifiers, getRiskLevel } from "@/data/models";
import { calculateScenarioRisk } from "@/utils/riskCalculator";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, BarChart3, Download, Upload, Save } from "lucide-react";

interface ScenarioPlannerProps {
  division: ElectoralDivision;
  viewMode: 'current' | 'future';
  projectionYear?: string;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ 
  division,
  viewMode, 
  projectionYear = "2030"
}) => {
  const { toast } = useToast();
  
  // Get base risk assessment based on view mode and projection year
  const getBaseRisk = (): RiskAssessment => {
    if (viewMode === 'current') {
      return division.currentRisk;
    }
    
    // Generate dynamic future risk data based on projection year
    const baseRisk = division.futureRisk;
    const yearFactor = getYearFactor(projectionYear);
    
    return {
      overall: Math.min(100, Math.round(baseRisk.overall * yearFactor)),
      factors: {
        dependencyRatio: Math.min(100, Math.round(baseRisk.factors.dependencyRatio * yearFactor)),
        hospitalStress: Math.min(100, Math.round(baseRisk.factors.hospitalStress * (yearFactor * 0.9))),
        isolationScore: Math.min(100, Math.round(baseRisk.factors.isolationScore * (yearFactor * 1.1))),
        walkability: Math.min(100, Math.round(baseRisk.factors.walkability * (yearFactor * 0.95))),
        environmentalScore: Math.min(100, Math.round(baseRisk.factors.environmentalScore * (yearFactor * 1.2))),
      }
    };
  };
  
  // Function to calculate a factor based on the selected year
  function getYearFactor(year: string): number {
    switch (year) {
      case "2025":
        return 1.05;
      case "2030":
        return 1.15;
      case "2035":
        return 1.25;
      case "2040":
        return 1.35;
      case "2050":
        return 1.5;
      default:
        return 1.15; // Default to 2030 factor
    }
  }

  // Default modifiers (0% change)
  const initialModifiers: ScenarioModifiers = {
    dependencyRatioChange: 0,
    hospitalStressChange: 0,
    isolationScoreChange: 0,
    walkabilityChange: 0,
    environmentalScoreChange: 0,
  };

  const [baseRisk, setBaseRisk] = useState<RiskAssessment>(getBaseRisk());
  const [modifiers, setModifiers] = useState<ScenarioModifiers>(initialModifiers);
  const [modifiedRisk, setModifiedRisk] = useState<RiskAssessment>(baseRisk);

  // Update base risk when view mode or projection year changes
  useEffect(() => {
    const newBaseRisk = getBaseRisk();
    setBaseRisk(newBaseRisk);
    // Always set modified risk to match base risk initially
    setModifiedRisk({...newBaseRisk});
    // Reset modifiers as well when the view mode or projection year changes
    setModifiers(initialModifiers);
  }, [viewMode, projectionYear, division]);

  // Recalculate risk when modifiers change
  useEffect(() => {
    // Calculate new risk whenever modifiers change
    const newRisk = calculateScenarioRisk(baseRisk, modifiers);
    setModifiedRisk(newRisk);
  }, [modifiers, baseRisk]);

  const handleModifierChange = (key: keyof ScenarioModifiers, value: number[]) => {
    setModifiers(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const resetModifiers = () => {
    setModifiers(initialModifiers);
    // Reset modified risk to match base risk
    setModifiedRisk({...baseRisk});
    toast({
      title: "Scenario Reset",
      description: "All modifiers have been reset to their default values.",
    });
  };

  const saveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: `Mitigation scenario for ${division.name} has been saved.`,
    });
  };

  const getImprovementText = () => {
    const diff = baseRisk.overall - modifiedRisk.overall;
    
    if (diff > 15) return "Dramatic Improvement";
    if (diff > 5) return "Significant Improvement";
    if (diff > 0) return "Slight Improvement";
    if (diff === 0) return "No Change";
    if (diff > -5) return "Slight Deterioration";
    if (diff > -15) return "Significant Deterioration";
    return "Dramatic Deterioration";
  };

  const getDiffClass = () => {
    const diff = baseRisk.overall - modifiedRisk.overall;
    if (diff > 0) return "text-green-600";
    if (diff < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Scenario Planner <span className="text-sm text-muted-foreground ml-2">Adjust factors to see impact</span></div>
          {viewMode === 'future' && 
            <span className="text-sm text-blue-600 font-medium">
              Based on {projectionYear} projections
            </span>
          }
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders for adjusting factors */}
        <div className="space-y-5">
          <h3 className="text-lg font-medium">Mitigation Factors</h3>
          <p className="text-sm text-muted-foreground mb-4">Adjust these factors to see how they could impact the division's risk score.</p>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="dependency-slider" className="text-sm font-medium">Dependency Ratio Change</label>
                <span className="text-sm">{modifiers.dependencyRatioChange > 0 ? '+' : ''}{modifiers.dependencyRatioChange}%</span>
              </div>
              <Slider 
                id="dependency-slider"
                min={-40} 
                max={40} 
                step={5} 
                value={[modifiers.dependencyRatioChange]}
                onValueChange={(value) => handleModifierChange('dependencyRatioChange', value)}
                className="py-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="hospital-slider" className="text-sm font-medium">Hospital Stress Change</label>
                <span className="text-sm">{modifiers.hospitalStressChange > 0 ? '+' : ''}{modifiers.hospitalStressChange}%</span>
              </div>
              <Slider 
                id="hospital-slider"
                min={-40} 
                max={40} 
                step={5} 
                value={[modifiers.hospitalStressChange]} 
                onValueChange={(value) => handleModifierChange('hospitalStressChange', value)}
                className="py-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="isolation-slider" className="text-sm font-medium">Isolation Score Change</label>
                <span className="text-sm">{modifiers.isolationScoreChange > 0 ? '+' : ''}{modifiers.isolationScoreChange}%</span>
              </div>
              <Slider 
                id="isolation-slider"
                min={-40} 
                max={40} 
                step={5} 
                value={[modifiers.isolationScoreChange]} 
                onValueChange={(value) => handleModifierChange('isolationScoreChange', value)}
                className="py-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="walkability-slider" className="text-sm font-medium">Walkability Change</label>
                <span className="text-sm">{modifiers.walkabilityChange > 0 ? '+' : ''}{modifiers.walkabilityChange}%</span>
              </div>
              <Slider 
                id="walkability-slider"
                min={-40} 
                max={40} 
                step={5} 
                value={[modifiers.walkabilityChange]} 
                onValueChange={(value) => handleModifierChange('walkabilityChange', value)}
                className="py-1"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="environmental-slider" className="text-sm font-medium">Environmental Score Change</label>
                <span className="text-sm">{modifiers.environmentalScoreChange > 0 ? '+' : ''}{modifiers.environmentalScoreChange}%</span>
              </div>
              <Slider 
                id="environmental-slider"
                min={-40} 
                max={40} 
                step={5} 
                value={[modifiers.environmentalScoreChange]} 
                onValueChange={(value) => handleModifierChange('environmentalScoreChange', value)}
                className="py-1"
              />
            </div>
          </div>
        </div>

        {/* Risk Impact Analysis */}
        <div className="space-y-5">
          <h3 className="text-lg font-medium">Impact Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4">See how your adjustments affect the division's risk assessment.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Current Risk Score</h4>
                <p className="text-2xl font-bold">{baseRisk.overall}</p>
              </div>
              
              <ArrowRight className="mx-4 text-gray-400" size={24} />
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Modified Risk Score</h4>
                <p className="text-2xl font-bold">{modifiedRisk.overall}</p>
              </div>
              
              <div className={`ml-4 text-right ${getDiffClass()}`}>
                <h4 className="text-sm font-semibold">Change</h4>
                <p className="text-xl font-bold">
                  {baseRisk.overall < modifiedRisk.overall ? '+' : ''}
                  {modifiedRisk.overall - baseRisk.overall}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-gray-100">
              <h4 className="text-sm font-medium mb-1">Risk Level Change</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full bg-risk-${getRiskLevel(baseRisk.overall)}`}></span>
                  <span className="text-sm capitalize">{getRiskLevel(baseRisk.overall).replace('-', ' ')}</span>
                </div>
                <ArrowRight className="mx-2 text-gray-400" size={16} />
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full bg-risk-${getRiskLevel(modifiedRisk.overall)}`}></span>
                  <span className="text-sm capitalize">{getRiskLevel(modifiedRisk.overall).replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-gray-100">
              <h4 className="text-sm font-medium mb-1">Assessment</h4>
              <p className="text-sm">{getImprovementText()}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetModifiers}>Reset</Button>
          <Button variant="outline" size="sm" onClick={saveScenario} className="flex items-center gap-1.5">
            <Save size={14} /> Save Scenario
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download size={14} /> Export
          </Button>
          <Button size="sm" className="flex items-center gap-1.5">
            <BarChart3 size={14} /> Generate Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScenarioPlanner;

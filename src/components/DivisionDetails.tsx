
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { BarChart, LineChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

interface DivisionDetailsProps {
  division: ElectoralDivision;
  viewMode: 'current' | 'future';
  projectionYear?: string;
  onViewModeChange: (mode: 'current' | 'future') => void;
}

const DivisionDetails: React.FC<DivisionDetailsProps> = ({
  division,
  viewMode,
  projectionYear = "2030",
  onViewModeChange,
}) => {
  // Use projection year to calculate adjusted risk
  const risk = React.useMemo(() => {
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
  }, [division, viewMode, projectionYear]);

  const riskLevel = getRiskLevel(risk.overall);

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

  // Create data for the factor comparison chart
  const factorData = [
    { name: "Dependency Ratio", value: risk.factors.dependencyRatio, fill: "#4ade80" },
    { name: "Hospital Stress", value: risk.factors.hospitalStress, fill: "#fb7185" },
    { name: "Isolation Score", value: risk.factors.isolationScore, fill: "#60a5fa" },
    { name: "Walkability", value: risk.factors.walkability, fill: "#fbbf24" },
    { name: "Environmental Score", value: risk.factors.environmentalScore, fill: "#34d399" },
  ];

  // Create data for comparison between current and future
  const comparisonData = [
    { 
      name: "Current",
      "Dependency Ratio": division.currentRisk.factors.dependencyRatio,
      "Hospital Stress": division.currentRisk.factors.hospitalStress,
      "Isolation Score": division.currentRisk.factors.isolationScore,
      "Walkability": division.currentRisk.factors.walkability,
      "Environmental Score": division.currentRisk.factors.environmentalScore,
    },
    { 
      name: viewMode === 'future' ? projectionYear : 'Future',
      "Dependency Ratio": risk.factors.dependencyRatio,
      "Hospital Stress": risk.factors.hospitalStress,
      "Isolation Score": risk.factors.isolationScore,
      "Walkability": risk.factors.walkability,
      "Environmental Score": risk.factors.environmentalScore,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{division.name}</CardTitle>
            <p className="text-muted-foreground">{division.county} • Population: {division.population.toLocaleString()}</p>
            {viewMode === 'future' && 
              <p className="text-sm text-blue-600 font-medium mt-1">
                Projection for {projectionYear}
              </p>
            }
          </div>
          
          <Tabs value={viewMode} onValueChange={onViewModeChange}>
            <TabsList>
              <TabsTrigger value="current">
                Current
              </TabsTrigger>
              <TabsTrigger value="future">
                Future
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Overall Risk Assessment</h3>
              <div className={`text-4xl font-bold text-risk-${riskLevel}`}>
                {risk.overall}
                <span className="text-base font-normal text-muted-foreground ml-1">/ 100</span>
                <span className="block text-sm font-medium capitalize mt-1">
                  {riskLevel.replace('-', ' ')} Risk
                </span>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-2">Risk Factors</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Dependency Ratio</span>
                  <span className="text-sm font-medium">{risk.factors.dependencyRatio}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${risk.factors.dependencyRatio}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Hospital Stress</span>
                  <span className="text-sm font-medium">{risk.factors.hospitalStress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${risk.factors.hospitalStress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Isolation Score</span>
                  <span className="text-sm font-medium">{risk.factors.isolationScore}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${risk.factors.isolationScore}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Walkability</span>
                  <span className="text-sm font-medium">{risk.factors.walkability}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${risk.factors.walkability}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Environmental Score</span>
                  <span className="text-sm font-medium">{risk.factors.environmentalScore}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${risk.factors.environmentalScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Factor Comparison</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={factorData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-2">Current vs. {viewMode === 'future' ? projectionYear : 'Future'}</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={comparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Dependency Ratio" stroke="#4ade80" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Hospital Stress" stroke="#fb7185" />
                  <Line type="monotone" dataKey="Isolation Score" stroke="#60a5fa" />
                  <Line type="monotone" dataKey="Walkability" stroke="#fbbf24" />
                  <Line type="monotone" dataKey="Environmental Score" stroke="#34d399" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DivisionDetails;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { BarChart, LineChart } from "recharts";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

interface DivisionDetailsProps {
  division: ElectoralDivision;
  viewMode: 'current' | 'future';
  onViewModeChange: (mode: 'current' | 'future') => void;
}

const DivisionDetails: React.FC<DivisionDetailsProps> = ({
  division,
  viewMode,
  onViewModeChange,
}) => {
  const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
  const riskLevel = getRiskLevel(risk.overall);

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
      name: "Future",
      "Dependency Ratio": division.futureRisk.factors.dependencyRatio,
      "Hospital Stress": division.futureRisk.factors.hospitalStress,
      "Isolation Score": division.futureRisk.factors.isolationScore,
      "Walkability": division.futureRisk.factors.walkability,
      "Environmental Score": division.futureRisk.factors.environmentalScore,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{division.name}</CardTitle>
            <p className="text-muted-foreground">{division.county} • Population: {division.population.toLocaleString()}</p>
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

            <h3 className="text-lg font-medium mt-6 mb-2">Current vs. Future</h3>
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

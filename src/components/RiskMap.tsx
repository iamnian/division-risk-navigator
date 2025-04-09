
import React, { useState, useRef, useEffect } from "react";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { Map as MapIcon, Layers, Info, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface RiskMapProps {
  divisions: ElectoralDivision[];
  selectedDivision: ElectoralDivision | null;
  onSelectDivision: (division: ElectoralDivision) => void;
  viewMode: 'current' | 'future';
}

const RiskMap: React.FC<RiskMapProps> = ({
  divisions,
  selectedDivision,
  onSelectDivision,
  viewMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [showDivisionList, setShowDivisionList] = useState(true);
  const [selectedMap, setSelectedMap] = useState("map1");
  const [animateIn, setAnimateIn] = useState(false);

  // Map URLs with updated descriptive labels
  const mapUrls = {
    map1: "/maps/map1.html", // Forecasted Risk
    map2: "/maps/map2.html", // Total Risk
    map3: "/maps/map3.html", // Old Age Dependency Ratio
    map4: "/maps/map4.html", // Hospital Proximity Risk Scores
  };

  const mapLabels = {
    map1: "Forecasted Risk",
    map2: "Total Risk",
    map3: "Old Age Dependency",
    map4: "Hospital Proximity",
  };

  // Add animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div 
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-5 h-[550px] relative overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MapIcon className="text-blue-400 h-6 w-6" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold tracking-tight flex items-center gap-3">
                Ireland Electoral Division Risk Map
                <Badge variant="outline" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-400/30 animate-pulse-subtle">
                  {viewMode === 'current' ? 'Current Risk' : 'Future Risk'}
                </Badge>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Interactive visualization of risk factors across electoral divisions
              </p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/70 transition-all duration-200 flex items-center gap-2 border border-gray-700/50 bg-gray-800/70 hover:bg-blue-900/30 hover:border-blue-500/30"
                  onClick={() => setShowDivisionList(!showDivisionList)}
                >
                  <Layers size={18} className="text-blue-400" />
                  <span className="text-sm font-medium">{showDivisionList ? 'Hide List' : 'Show List'}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                {showDivisionList ? 'Hide division list panel' : 'Show division list panel'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Tabs value={selectedMap} onValueChange={setSelectedMap} className="w-full">
          <TabsList className="bg-gray-800/80 mb-5 p-1.5 backdrop-blur-sm border border-gray-700/50 rounded-lg w-full flex justify-between">
            {Object.entries(mapLabels).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 font-medium py-2.5"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[400px]">
            {/* Map visualization - restored to pristine state without blurry effects */}
            <div className="lg:col-span-2 relative h-full border border-gray-700/60 rounded-lg bg-gray-800 shadow-inner overflow-hidden">
              {Object.keys(mapUrls).map((mapKey) => (
                <TabsContent key={mapKey} value={mapKey} className="h-full">
                  <iframe 
                    src={mapUrls[mapKey as keyof typeof mapUrls]} 
                    className="w-full h-full border-0"
                    title={mapLabels[mapKey as keyof typeof mapLabels]}
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                </TabsContent>
              ))}
            </div>
            
            {/* Division list */}
            {showDivisionList && (
              <div className="h-full overflow-y-auto border border-gray-700/60 rounded-lg bg-gray-800/70 p-4 backdrop-blur-sm shadow-inner transition-all duration-300 animate-fade-in">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/60">
                  <div className="bg-blue-500/20 p-1.5 rounded">
                    <Info size={16} className="text-blue-400" />
                  </div>
                  <h3 className="text-white text-sm font-medium">Electoral Divisions</h3>
                  <Badge variant="outline" className="ml-auto bg-gray-700/60 text-gray-300 text-xs border-gray-600/50">
                    {divisions.length} total
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {divisions.map(division => {
                    const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
                    const riskLevel = getRiskLevel(risk.overall);
                    const isSelected = selectedDivision?.id === division.id;
                    
                    return (
                      <button 
                        key={division.id}
                        className={`
                          p-3.5 rounded-md text-left transition-all duration-300 w-full
                          ${isSelected ? 'ring-2 ring-white/80 scale-[1.02] shadow-lg shadow-blue-900/30' : ''}
                          bg-risk-${riskLevel} bg-opacity-80 hover:bg-opacity-95
                          hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-900/20
                          backdrop-blur-sm flex flex-col gap-1.5
                        `}
                        onClick={() => onSelectDivision(division)}
                      >
                        <div className="text-white font-semibold text-base flex justify-between items-center">
                          <span>{division.name}</span>
                          <Badge className={`bg-risk-${riskLevel} text-white font-medium border-white/20`}>
                            {risk.overall}/100
                          </Badge>
                        </div>
                        <div className="text-white/80 text-sm flex justify-between items-center">
                          <span>Risk Level:</span>
                          <span className="font-semibold capitalize">{riskLevel.replace('-', ' ')}</span>
                        </div>
                        <div className="text-white/70 text-xs mt-1">{division.county}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
      
      <div className="absolute bottom-5 right-5 flex gap-3 items-center p-2.5 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700/60 shadow-lg animate-slide-in">
        <span className="text-white text-xs font-medium">Risk Level:</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-low ring-1 ring-white/30"></div>
            <span className="text-white text-xs">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-medium ring-1 ring-white/30"></div>
            <span className="text-white text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-high ring-1 ring-white/30"></div>
            <span className="text-white text-xs">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-very-high ring-1 ring-white/30"></div>
            <span className="text-white text-xs">Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;

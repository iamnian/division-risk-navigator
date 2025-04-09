
import React, { useState, useRef } from "react";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { Map as MapIcon, Layers, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

  // Map URLs with descriptive labels
  const mapUrls = {
    map1: "/maps/map1.html", // Forecasted Risk
    map2: "/maps/map2.html", // Population
    map3: "/maps/map3.html",
    map4: "/maps/map4.html",
  };

  const mapLabels = {
    map1: "Forecasted Risk",
    map2: "Population",
    map3: "Map 3",
    map4: "Map 4",
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 h-[550px] relative overflow-hidden shadow-xl border border-gray-800">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <MapIcon className="text-blue-400 h-6 w-6" />
          <h2 className="text-white text-2xl font-bold tracking-tight">
            Ireland Electoral Division Risk Map
          </h2>
          <Badge variant="outline" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-400/30">
            {viewMode === 'current' ? 'Current Risk' : 'Future Risk'}
          </Badge>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-2 border border-gray-700/50 bg-gray-800/50"
                onClick={() => setShowDivisionList(!showDivisionList)}
              >
                <Layers size={18} className="text-blue-400" />
                <span className="text-sm font-medium">{showDivisionList ? 'Hide List' : 'Show List'}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {showDivisionList ? 'Hide division list panel' : 'Show division list panel'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Tabs value={selectedMap} onValueChange={setSelectedMap} className="w-full">
        <TabsList className="bg-gray-800/70 mb-5 p-1 backdrop-blur-sm border border-gray-700/50 rounded-lg w-full flex justify-between">
          {Object.entries(mapLabels).map(([key, label]) => (
            <TabsTrigger 
              key={key} 
              value={key} 
              className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 font-medium"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-[400px]">
          {/* Map visualization */}
          <div className="lg:col-span-2 relative h-full border border-gray-700/50 rounded-lg bg-gray-800/60 shadow-inner overflow-hidden" ref={mapContainerRef}>
            {Object.keys(mapUrls).map((mapKey) => (
              <TabsContent key={mapKey} value={mapKey} className="h-full">
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px] z-10"></div>
                <iframe 
                  src={mapUrls[mapKey as keyof typeof mapUrls]} 
                  className="w-full h-full border-0 z-0"
                  title={mapLabels[mapKey as keyof typeof mapLabels]}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              </TabsContent>
            ))}
          </div>
          
          {/* Division list */}
          {showDivisionList && (
            <div className="h-full overflow-y-auto border border-gray-700/50 rounded-lg bg-gray-800/60 p-3 backdrop-blur-sm shadow-inner">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/50">
                <Info size={16} className="text-blue-400" />
                <h3 className="text-white text-sm font-medium">Electoral Divisions</h3>
                <Badge variant="outline" className="ml-auto bg-gray-700/50 text-gray-300 text-xs">
                  {divisions.length} total
                </Badge>
              </div>
              
              <div className="space-y-2.5">
                {divisions.map(division => {
                  const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
                  const riskLevel = getRiskLevel(risk.overall);
                  const isSelected = selectedDivision?.id === division.id;
                  
                  return (
                    <button 
                      key={division.id}
                      className={`
                        p-3 rounded-md text-left transition-all w-full
                        ${isSelected ? 'ring-2 ring-white/70 scale-[1.02]' : ''}
                        bg-risk-${riskLevel} bg-opacity-80 hover:bg-opacity-90
                        hover:translate-y-[-2px] hover:shadow-lg
                        backdrop-blur-sm flex flex-col gap-1
                      `}
                      onClick={() => onSelectDivision(division)}
                    >
                      <div className="text-white font-semibold">{division.name}</div>
                      <div className="text-white/90 text-sm flex justify-between items-center">
                        <span>Risk Score:</span>
                        <Badge className={`bg-risk-${riskLevel} text-white font-medium`}>
                          {risk.overall}/100
                        </Badge>
                      </div>
                      <div className="text-white/70 text-xs">{division.county}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Tabs>
      
      <div className="absolute bottom-5 right-5 flex gap-3 items-center p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50">
        <div className="text-white text-xs font-medium">Risk Level:</div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-risk-low ring-1 ring-white/20"></div>
            <span className="text-white text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-risk-medium ring-1 ring-white/20"></div>
            <span className="text-white text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-risk-high ring-1 ring-white/20"></div>
            <span className="text-white text-xs">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-risk-very-high ring-1 ring-white/20"></div>
            <span className="text-white text-xs">Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;

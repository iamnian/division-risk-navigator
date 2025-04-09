
import React, { useState, useRef } from "react";
import { ElectoralDivision, getRiskLevel } from "@/data/models";
import { Map as MapIcon, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  // Map URLs - replace these with your actual HTML map URLs
  // You can either host these HTML files externally or include them in the public folder
  const mapUrls = {
    map1: "/maps/map1.html",
    map2: "/maps/map2.html",
    map3: "/maps/map3.html",
    map4: "/maps/map4.html",
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-[500px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl">
          Ireland Electoral Division Risk Map - {viewMode === 'current' ? 'Current' : 'Future'} Risk
        </h2>
        <div className="flex items-center gap-2">
          <button 
            className="p-1 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
            onClick={() => setShowDivisionList(!showDivisionList)}
          >
            <MapIcon size={18} />
            <span className="ml-1 text-sm">{showDivisionList ? 'Hide List' : 'Show List'}</span>
          </button>
        </div>
      </div>
      
      <Tabs value={selectedMap} onValueChange={setSelectedMap} className="w-full">
        <TabsList className="bg-gray-800 mb-4">
          <TabsTrigger value="map1" className="data-[state=active]:bg-blue-600">
            Map 1
          </TabsTrigger>
          <TabsTrigger value="map2" className="data-[state=active]:bg-blue-600">
            Map 2
          </TabsTrigger>
          <TabsTrigger value="map3" className="data-[state=active]:bg-blue-600">
            Map 3
          </TabsTrigger>
          <TabsTrigger value="map4" className="data-[state=active]:bg-blue-600">
            Map 4
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
          {/* Map visualization */}
          <div className="lg:col-span-2 relative h-full border border-gray-700 rounded-lg bg-gray-800" ref={mapContainerRef}>
            {/* Custom HTML maps */}
            {["map1", "map2", "map3", "map4"].map((mapKey) => (
              <TabsContent key={mapKey} value={mapKey} className="h-full">
                <iframe 
                  src={mapUrls[mapKey as keyof typeof mapUrls]} 
                  className="w-full h-full border-0"
                  title={`Map ${mapKey.slice(-1)}`}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
              </TabsContent>
            ))}
          </div>
          
          {/* Division list */}
          {showDivisionList && (
            <div className="h-full overflow-y-auto border border-gray-700 rounded-lg bg-gray-800 p-2">
              <h3 className="text-white text-sm mb-2">Electoral Divisions</h3>
              <div className="space-y-2">
                {divisions.map(division => {
                  const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
                  const riskLevel = getRiskLevel(risk.overall);
                  const isSelected = selectedDivision?.id === division.id;
                  
                  return (
                    <button 
                      key={division.id}
                      className={`
                        p-2 rounded-md text-left transition-all w-full
                        ${isSelected ? 'ring-2 ring-white scale-105' : ''}
                        bg-risk-${riskLevel} bg-opacity-80 hover:bg-opacity-100
                      `}
                      onClick={() => onSelectDivision(division)}
                    >
                      <div className="text-white font-medium">{division.name}</div>
                      <div className="text-white/80 text-sm">Risk: {risk.overall}/100</div>
                      <div className="text-white/60 text-xs">{division.county}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Tabs>
      
      <div className="absolute bottom-4 right-4 flex gap-2 items-center">
        <div className="text-white text-xs">Risk Level:</div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-low"></div>
            <span className="text-white text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-medium"></div>
            <span className="text-white text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-high"></div>
            <span className="text-white text-xs">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-risk-very-high"></div>
            <span className="text-white text-xs">Very High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;

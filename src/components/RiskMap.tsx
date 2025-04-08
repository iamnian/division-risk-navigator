
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
  const [selectedMap, setSelectedMap] = useState("default");

  // Map URLs - replace these with your actual HTML map URLs
  // You can either host these HTML files externally or include them in the public folder
  const mapUrls = {
    default: "", // This will show our built-in map
    map1: "/maps/map1.html",
    map2: "/maps/map2.html",
    map3: "/maps/map3.html",
    map4: "/maps/map4.html",
    map5: "/maps/map5.html",
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
          <TabsTrigger value="default" className="data-[state=active]:bg-blue-600">
            Default Map
          </TabsTrigger>
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
          <TabsTrigger value="map5" className="data-[state=active]:bg-blue-600">
            Map 5
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
          {/* Map visualization */}
          <div className="lg:col-span-2 relative h-full border border-gray-700 rounded-lg bg-gray-800" ref={mapContainerRef}>
            <TabsContent value="default" className="h-full">
              {/* Original map visualization */}
              <DefaultMapView 
                divisions={divisions} 
                selectedDivision={selectedDivision} 
                onSelectDivision={onSelectDivision} 
                viewMode={viewMode} 
                mapContainerRef={mapContainerRef}
              />
            </TabsContent>
            
            {/* Custom HTML maps */}
            {["map1", "map2", "map3", "map4", "map5"].map((mapKey) => (
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

// Extract the original map functionality into a separate component
const DefaultMapView: React.FC<{
  divisions: ElectoralDivision[];
  selectedDivision: ElectoralDivision | null;
  onSelectDivision: (division: ElectoralDivision) => void;
  viewMode: 'current' | 'future';
  mapContainerRef: React.RefObject<HTMLDivElement>;
}> = ({ divisions, selectedDivision, onSelectDivision, viewMode, mapContainerRef }) => {
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);

  // Simple mapping of county positions for Ireland visualization
  // These are approximate relative positions (normalized 0-1 coordinates)
  const countyPositions: Record<string, [number, number]> = {
    "Dublin": [0.75, 0.38],
    "Cork": [0.32, 0.85],
    "Galway": [0.25, 0.4],
    "Limerick": [0.3, 0.65],
    "Kerry": [0.15, 0.75],
    "Donegal": [0.35, 0.08],
    "Meath": [0.65, 0.3]
    // Add more counties as needed
  };
  
  // Draw the map with risk heatmap
  React.useEffect(() => {
    const canvas = mapCanvasRef.current;
    const container = mapContainerRef.current;
    
    if (!canvas || !container) return;
    
    // Set canvas size to container size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Ireland outline (simplified shape)
    ctx.beginPath();
    ctx.fillStyle = "#d1d5db"; // Base color for Ireland
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    
    // Simplified path for Ireland outline
    // Starting from north (Donegal) and going clockwise
    const w = canvas.width * 0.8;
    const h = canvas.height * 0.8;
    const offsetX = canvas.width * 0.1;
    const offsetY = canvas.height * 0.1;
    
    ctx.moveTo(offsetX + w * 0.35, offsetY + h * 0.05); // Northern point
    ctx.bezierCurveTo(
      offsetX + w * 0.2, offsetY + h * 0.2,  // control point 1
      offsetX + w * 0.1, offsetY + h * 0.4,  // control point 2
      offsetX + w * 0.1, offsetY + h * 0.6   // Western coast point
    );
    ctx.bezierCurveTo(
      offsetX + w * 0.1, offsetY + h * 0.8,  // control point 1
      offsetX + w * 0.3, offsetY + h * 0.9,  // control point 2
      offsetX + w * 0.5, offsetY + h * 0.9   // Southern point
    );
    ctx.bezierCurveTo(
      offsetX + w * 0.7, offsetY + h * 0.9,  // control point 1
      offsetX + w * 0.8, offsetY + h * 0.7,  // control point 2
      offsetX + w * 0.8, offsetY + h * 0.5   // Eastern coast point
    );
    ctx.bezierCurveTo(
      offsetX + w * 0.8, offsetY + h * 0.3,  // control point 1
      offsetX + w * 0.6, offsetY + h * 0.1,  // control point 2
      offsetX + w * 0.35, offsetY + h * 0.05  // Back to start
    );
    
    ctx.fill();
    ctx.stroke();
    
    // Draw divisions on the map
    divisions.forEach(division => {
      const countyPos = countyPositions[division.county];
      if (!countyPos) return;
      
      const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
      const riskLevel = getRiskLevel(risk.overall);
      
      // Get the position on the canvas
      const x = offsetX + w * countyPos[0];
      const y = offsetY + h * countyPos[1];
      
      // Draw division circle with risk color
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      
      // Set color based on risk level
      switch(riskLevel) {
        case 'low':
          ctx.fillStyle = 'rgba(34, 197, 94, 0.8)'; // green-500
          break;
        case 'medium':
          ctx.fillStyle = 'rgba(234, 179, 8, 0.8)'; // yellow-500
          break;
        case 'high':
          ctx.fillStyle = 'rgba(249, 115, 22, 0.8)'; // orange-500
          break;
        case 'very-high':
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // red-500
          break;
      }
      
      ctx.fill();
      ctx.stroke();
      
      // Draw division name
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(division.county, x, y + 25);
      
      // If selected, draw highlight
      if (selectedDivision && selectedDivision.id === division.id) {
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    // Add click handler to canvas
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Check if click is on a division
      divisions.forEach(division => {
        const countyPos = countyPositions[division.county];
        if (!countyPos) return;
        
        const x = offsetX + w * countyPos[0];
        const y = offsetY + h * countyPos[1];
        
        // Simple distance check for click
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        if (distance <= 15) {
          onSelectDivision(division);
        }
      });
    };
    
    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [divisions, selectedDivision, viewMode, onSelectDivision, mapContainerRef]);

  return (
    <>
      <canvas ref={mapCanvasRef} className="absolute inset-0 w-full h-full"></canvas>
      <div className="absolute bottom-2 right-2 p-2 bg-gray-900/60 rounded-md">
        <p className="text-white text-xs">Click on a county to view details</p>
      </div>
    </>
  );
};

export default RiskMap;

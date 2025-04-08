
import React, { useState } from "react";
import { ElectoralDivision, getRiskLevel } from "@/data/models";

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
  // In a real implementation, we'd use a mapping library like react-leaflet
  // For now, we'll create a simplified visual representation
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 h-[500px] relative overflow-hidden">
      <h2 className="text-white text-xl mb-4">
        Ireland Electoral Division Risk Map - {viewMode === 'current' ? 'Current' : 'Future'} Risk
      </h2>
      
      {/* Simple map visualization */}
      <div className="relative h-[400px] border border-gray-700 rounded-lg bg-gray-800">
        {/* This would be replaced with actual map rendering */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Interactive map visualization would be here</p>
        </div>
        
        {/* Simplified division representation */}
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {divisions.map(division => {
              const risk = viewMode === 'current' ? division.currentRisk : division.futureRisk;
              const riskLevel = getRiskLevel(risk.overall);
              const isSelected = selectedDivision?.id === division.id;
              
              return (
                <button 
                  key={division.id}
                  className={`
                    p-2 rounded-md text-left transition-all
                    ${isSelected ? 'ring-2 ring-white scale-105' : ''}
                    bg-risk-${riskLevel} bg-opacity-80 hover:bg-opacity-100
                  `}
                  onClick={() => onSelectDivision(division)}
                >
                  <div className="text-white font-medium">{division.name}</div>
                  <div className="text-white/80 text-sm">Risk: {risk.overall}/100</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
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

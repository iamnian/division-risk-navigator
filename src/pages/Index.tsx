
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import RiskMap from "@/components/RiskMap";
import DivisionDetails from "@/components/DivisionDetails";
import ScenarioPlanner from "@/components/ScenarioPlanner";
import SearchBar from "@/components/SearchBar";
import { divisions, searchDivisions } from "@/data/mockData";
import { ElectoralDivision } from "@/data/models";

const Index = () => {
  const [selectedDivision, setSelectedDivision] = useState<ElectoralDivision | null>(divisions[0]);
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');
  const [filteredDivisions, setFilteredDivisions] = useState(divisions);

  // Handle search
  const handleSearch = (query: string) => {
    setFilteredDivisions(searchDivisions(query));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Division Risk Navigator</h1>
              <p className="text-gray-400">Electoral division risk assessment and forecasting tool</p>
            </div>
            <div className="w-full md:w-64">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Risk Map */}
          <RiskMap 
            divisions={filteredDivisions}
            selectedDivision={selectedDivision}
            onSelectDivision={setSelectedDivision}
            viewMode={viewMode}
          />

          {/* Division details and scenario planning */}
          {selectedDivision && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-bold">Selected Division: {selectedDivision.name}</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'current' ? 'default' : 'outline'} 
                      onClick={() => setViewMode('current')}
                    >
                      Current
                    </Button>
                    <Button 
                      variant={viewMode === 'future' ? 'default' : 'outline'} 
                      onClick={() => setViewMode('future')}
                    >
                      Future
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <DivisionDetails 
                  division={selectedDivision} 
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                
                <ScenarioPlanner 
                  division={selectedDivision}
                  viewMode={viewMode} 
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Risk scores are calculated based on Dependency Ratio, Hospital Stress, Isolation Score, and Walkability factors.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Division Risk Navigator - SIS Proposal © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RiskMap from "@/components/RiskMap";
import DivisionDetails from "@/components/DivisionDetails";
import ScenarioPlanner from "@/components/ScenarioPlanner";
import SearchBar from "@/components/SearchBar";
import { divisions, searchDivisions } from "@/data/mockData";
import { ElectoralDivision } from "@/data/models";
import { MapPin, TrendingUp, Clock, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [selectedDivision, setSelectedDivision] = useState<ElectoralDivision | null>(divisions[0]);
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');
  const [filteredDivisions, setFilteredDivisions] = useState(divisions);
  const [animateIn, setAnimateIn] = useState(false);
  const [projectionYear, setProjectionYear] = useState<string>("2030");

  // Handle search
  const handleSearch = (query: string) => {
    setFilteredDivisions(searchDivisions(query));
  };

  // Add animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-7 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className={`transition-all duration-700 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2.5 rounded-lg">
                  <MapPin className="text-blue-400 h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Division Risk Navigator</h1>
                  <p className="text-gray-400 mt-1">Electoral division risk assessment and forecasting tool</p>
                </div>
              </div>
            </div>
            <div className={`w-full md:w-72 transition-all duration-700 delay-300 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-7">
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
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">Selected Division: {selectedDivision.name}</h2>
                    <span className="text-sm text-gray-500">{selectedDivision.county}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'current' ? 'default' : 'outline'} 
                      onClick={() => setViewMode('current')}
                      className="gap-2 transition-all"
                      size="sm"
                    >
                      <Clock size={16} />
                      Current
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={viewMode === 'future' ? 'default' : 'outline'} 
                        onClick={() => setViewMode('future')}
                        className="gap-2 transition-all"
                        size="sm"
                      >
                        <TrendingUp size={16} />
                        Future
                      </Button>
                      
                      {viewMode === 'future' && (
                        <Select
                          value={projectionYear}
                          onValueChange={setProjectionYear}
                        >
                          <SelectTrigger className="w-24 h-9 border-blue-100 bg-blue-50 text-blue-900 text-xs">
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon size={14} />
                              <SelectValue placeholder="Year" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2030">2030</SelectItem>
                            <SelectItem value="2035">2035</SelectItem>
                            <SelectItem value="2040">2040</SelectItem>
                            <SelectItem value="2050">2050</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-10">
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
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm">
              Risk scores are calculated based on Dependency Ratio, Hospital Stress, Isolation Score, Walkability, and Environmental factors.
            </p>
            <p className="text-gray-500 text-xs mt-3">
              Division Risk Navigator - SIS Proposal © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

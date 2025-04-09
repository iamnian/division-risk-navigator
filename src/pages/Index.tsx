
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RiskMap from "@/components/RiskMap";
import DivisionDetails from "@/components/DivisionDetails";
import ScenarioPlanner from "@/components/ScenarioPlanner";
import SearchBar from "@/components/SearchBar";
import { divisions, searchDivisions } from "@/data/mockData";
import { ElectoralDivision } from "@/data/models";
import {
  MapPin,
  TrendingUp,
  Clock,
  CalendarIcon,
  GithubIcon,
  Download,
  HelpCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Index = () => {
  const [selectedDivision, setSelectedDivision] = useState<ElectoralDivision | null>(divisions[0]);
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');
  const [filteredDivisions, setFilteredDivisions] = useState(divisions);
  const [animateIn, setAnimateIn] = useState(false);
  const [projectionYear, setProjectionYear] = useState<string>("2030");
  const { toast } = useToast();

  // Handle search
  const handleSearch = (query: string) => {
    setFilteredDivisions(searchDivisions(query));
    if (query.trim().length > 0) {
      toast({
        title: "Search results",
        description: `Found ${searchDivisions(query).length} divisions matching "${query}"`,
      });
    } else {
      setFilteredDivisions(divisions);
    }
  };

  // Handle division selection
  const handleSelectDivision = (division: ElectoralDivision) => {
    setSelectedDivision(division);
    toast({
      title: "Division selected",
      description: `Now viewing ${division.name}, ${division.county}`,
    });
  };

  // Mock export data function
  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export is being prepared...",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Risk assessment data has been exported.",
      });
    }, 1500);
  };

  // Add animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
    
    // Welcome toast
    toast({
      title: "Welcome to Division Risk Navigator",
      description: "Interactive tool for electoral division risk assessment",
      duration: 5000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-950 text-white py-7 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className={`transition-all duration-700 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2.5 rounded-lg animate-pulse-subtle">
                  <MapPin className="text-blue-400 h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Division Risk Navigator</h1>
                  <p className="text-gray-400 mt-1">Electoral division risk assessment and forecasting tool</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-full md:w-72 transition-all duration-700 delay-300 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <SearchBar onSearch={handleSearch} />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2 mt-2">
        <Breadcrumb className="animate-fade-in">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Risk Assessment</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedDivision?.name || "Division"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-7">
          {/* Action bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleExportData}
                    >
                      <Download size={16} />
                      Export Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download risk assessment data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Division Risk Navigator helps you assess and forecast risk levels for electoral divisions. Use the search bar to find divisions, toggle between current and future views, and explore scenario planning.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Risk Map */}
          <RiskMap 
            divisions={filteredDivisions}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
            viewMode={viewMode}
          />

          {/* Division details and scenario planning */}
          {selectedDivision && (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Selected Division: {selectedDivision.name}</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedDivision.county}</span>
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
                          onValueChange={(year) => {
                            setProjectionYear(year);
                            toast({
                              title: "Projection year changed",
                              description: `Now showing projections for ${year}`,
                            });
                          }}
                        >
                          <SelectTrigger className="w-24 h-9 border-blue-100 bg-blue-50 text-blue-900 text-xs dark:bg-blue-900 dark:border-blue-800 dark:text-blue-100">
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
                  projectionYear={projectionYear}
                  onViewModeChange={setViewMode}
                />
                
                <ScenarioPlanner 
                  division={selectedDivision}
                  viewMode={viewMode}
                  projectionYear={projectionYear}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto">
            <a 
              href="https://github.com/your-username/division-risk-navigator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg border border-gray-700/50"
            >
              <GithubIcon size={18} />
              <span>View on GitHub</span>
            </a>
            
            <p className="text-gray-400 text-sm text-center">
              Risk scores are calculated based on Dependency Ratio, Hospital Stress, Isolation Score, Walkability, and Environmental factors.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Division Risk Navigator - SIS Proposal © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

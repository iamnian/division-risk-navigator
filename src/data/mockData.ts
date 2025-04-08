
import { ElectoralDivision } from "./models";

export const divisions: ElectoralDivision[] = [
  {
    id: "dublin-central",
    name: "Dublin Central",
    county: "Dublin",
    population: 125000,
    coordinates: [53.3498, -6.2603],
    currentRisk: {
      overall: 42,
      factors: {
        dependencyRatio: 35,
        hospitalStress: 58,
        isolationScore: 22,
        walkability: 75,
      }
    },
    futureRisk: {
      overall: 52,
      factors: {
        dependencyRatio: 45,
        hospitalStress: 63,
        isolationScore: 30,
        walkability: 70,
      }
    }
  },
  {
    id: "dublin-north",
    name: "Dublin North",
    county: "Dublin",
    population: 118000,
    coordinates: [53.4017, -6.3178],
    currentRisk: {
      overall: 35,
      factors: {
        dependencyRatio: 30,
        hospitalStress: 48,
        isolationScore: 20,
        walkability: 65,
      }
    },
    futureRisk: {
      overall: 45,
      factors: {
        dependencyRatio: 40,
        hospitalStress: 55,
        isolationScore: 28,
        walkability: 60,
      }
    }
  },
  {
    id: "cork-south-central",
    name: "Cork South-Central",
    county: "Cork",
    population: 105000,
    coordinates: [51.8979, -8.4706],
    currentRisk: {
      overall: 55,
      factors: {
        dependencyRatio: 48,
        hospitalStress: 62,
        isolationScore: 40,
        walkability: 65,
      }
    },
    futureRisk: {
      overall: 68,
      factors: {
        dependencyRatio: 57,
        hospitalStress: 70,
        isolationScore: 52,
        walkability: 60,
      }
    }
  },
  {
    id: "galway-west",
    name: "Galway West",
    county: "Galway",
    population: 92000,
    coordinates: [53.2707, -9.0568],
    currentRisk: {
      overall: 48,
      factors: {
        dependencyRatio: 44,
        hospitalStress: 52,
        isolationScore: 38,
        walkability: 58,
      }
    },
    futureRisk: {
      overall: 57,
      factors: {
        dependencyRatio: 52,
        hospitalStress: 60,
        isolationScore: 45,
        walkability: 52,
      }
    }
  },
  {
    id: "limerick-city",
    name: "Limerick City",
    county: "Limerick",
    population: 85000,
    coordinates: [52.6638, -8.6267],
    currentRisk: {
      overall: 62,
      factors: {
        dependencyRatio: 56,
        hospitalStress: 68,
        isolationScore: 45,
        walkability: 60,
      }
    },
    futureRisk: {
      overall: 72,
      factors: {
        dependencyRatio: 65,
        hospitalStress: 75,
        isolationScore: 55,
        walkability: 55,
      }
    }
  },
  {
    id: "donegal",
    name: "Donegal",
    county: "Donegal",
    population: 68000,
    coordinates: [54.9549, -7.7348],
    currentRisk: {
      overall: 72,
      factors: {
        dependencyRatio: 65,
        hospitalStress: 75,
        isolationScore: 80,
        walkability: 45,
      }
    },
    futureRisk: {
      overall: 80,
      factors: {
        dependencyRatio: 72,
        hospitalStress: 82,
        isolationScore: 85,
        walkability: 40,
      }
    }
  },
  {
    id: "kerry",
    name: "Kerry",
    county: "Kerry",
    population: 72000,
    coordinates: [52.1543, -9.5669],
    currentRisk: {
      overall: 58,
      factors: {
        dependencyRatio: 60,
        hospitalStress: 55,
        isolationScore: 70,
        walkability: 42,
      }
    },
    futureRisk: {
      overall: 65,
      factors: {
        dependencyRatio: 67,
        hospitalStress: 62,
        isolationScore: 75,
        walkability: 38,
      }
    }
  },
  {
    id: "meath-east",
    name: "Meath East",
    county: "Meath",
    population: 65000,
    coordinates: [53.6123, -6.6102],
    currentRisk: {
      overall: 40,
      factors: {
        dependencyRatio: 42,
        hospitalStress: 50,
        isolationScore: 35,
        walkability: 52,
      }
    },
    futureRisk: {
      overall: 48,
      factors: {
        dependencyRatio: 48,
        hospitalStress: 58,
        isolationScore: 42,
        walkability: 48,
      }
    }
  },
];

export function searchDivisions(query: string): ElectoralDivision[] {
  if (!query) return divisions;
  
  const lowerQuery = query.toLowerCase();
  return divisions.filter(
    div => div.name.toLowerCase().includes(lowerQuery) || 
           div.county.toLowerCase().includes(lowerQuery)
  );
}

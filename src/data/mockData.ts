
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
        environmentalScore: 45
      }
    },
    futureRisk: {
      overall: 52,
      factors: {
        dependencyRatio: 45,
        hospitalStress: 63,
        isolationScore: 30,
        walkability: 70,
        environmentalScore: 55
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
        environmentalScore: 38
      }
    },
    futureRisk: {
      overall: 45,
      factors: {
        dependencyRatio: 40,
        hospitalStress: 55,
        isolationScore: 28,
        walkability: 60,
        environmentalScore: 48
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
        environmentalScore: 58
      }
    },
    futureRisk: {
      overall: 68,
      factors: {
        dependencyRatio: 57,
        hospitalStress: 70,
        isolationScore: 52,
        walkability: 60,
        environmentalScore: 72
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
        environmentalScore: 43
      }
    },
    futureRisk: {
      overall: 57,
      factors: {
        dependencyRatio: 52,
        hospitalStress: 60,
        isolationScore: 45,
        walkability: 52,
        environmentalScore: 55
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
        environmentalScore: 64
      }
    },
    futureRisk: {
      overall: 72,
      factors: {
        dependencyRatio: 65,
        hospitalStress: 75,
        isolationScore: 55,
        walkability: 55,
        environmentalScore: 76
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
        environmentalScore: 78
      }
    },
    futureRisk: {
      overall: 80,
      factors: {
        dependencyRatio: 72,
        hospitalStress: 82,
        isolationScore: 85,
        walkability: 40,
        environmentalScore: 85
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
        environmentalScore: 63
      }
    },
    futureRisk: {
      overall: 65,
      factors: {
        dependencyRatio: 67,
        hospitalStress: 62,
        isolationScore: 75,
        walkability: 38,
        environmentalScore: 68
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
        environmentalScore: 47
      }
    },
    futureRisk: {
      overall: 48,
      factors: {
        dependencyRatio: 48,
        hospitalStress: 58,
        isolationScore: 42,
        walkability: 48,
        environmentalScore: 54
      }
    }
  },
  {
    id: "waterford",
    name: "Waterford",
    county: "Waterford",
    population: 78000,
    coordinates: [52.2593, -7.1128],
    currentRisk: {
      overall: 53,
      factors: {
        dependencyRatio: 50,
        hospitalStress: 58,
        isolationScore: 42,
        walkability: 55,
        environmentalScore: 51
      }
    },
    futureRisk: {
      overall: 62,
      factors: {
        dependencyRatio: 57,
        hospitalStress: 65,
        isolationScore: 49,
        walkability: 50,
        environmentalScore: 61
      }
    }
  },
  {
    id: "sligo-leitrim",
    name: "Sligo-Leitrim",
    county: "Sligo",
    population: 63000,
    coordinates: [54.2766, -8.4761],
    currentRisk: {
      overall: 58,
      factors: {
        dependencyRatio: 54,
        hospitalStress: 60,
        isolationScore: 65,
        walkability: 48,
        environmentalScore: 45
      }
    },
    futureRisk: {
      overall: 67,
      factors: {
        dependencyRatio: 62,
        hospitalStress: 68,
        isolationScore: 72,
        walkability: 45,
        environmentalScore: 52
      }
    }
  },
  {
    id: "wexford",
    name: "Wexford",
    county: "Wexford",
    population: 70000,
    coordinates: [52.3369, -6.4633],
    currentRisk: {
      overall: 51,
      factors: {
        dependencyRatio: 47,
        hospitalStress: 54,
        isolationScore: 58,
        walkability: 52,
        environmentalScore: 48
      }
    },
    futureRisk: {
      overall: 60,
      factors: {
        dependencyRatio: 55,
        hospitalStress: 62,
        isolationScore: 65,
        walkability: 48,
        environmentalScore: 57
      }
    }
  },
  // Adding more electoral divisions
  {
    id: "clare",
    name: "Clare",
    county: "Clare",
    population: 76000,
    coordinates: [52.9112, -8.9194],
    currentRisk: {
      overall: 47,
      factors: {
        dependencyRatio: 45,
        hospitalStress: 42,
        isolationScore: 53,
        walkability: 49,
        environmentalScore: 40
      }
    },
    futureRisk: {
      overall: 56,
      factors: {
        dependencyRatio: 52,
        hospitalStress: 48,
        isolationScore: 61,
        walkability: 45,
        environmentalScore: 47
      }
    }
  },
  {
    id: "laois-offaly",
    name: "Laois-Offaly",
    county: "Laois",
    population: 84000,
    coordinates: [53.0329, -7.3021],
    currentRisk: {
      overall: 45,
      factors: {
        dependencyRatio: 40,
        hospitalStress: 43,
        isolationScore: 50,
        walkability: 47,
        environmentalScore: 42
      }
    },
    futureRisk: {
      overall: 53,
      factors: {
        dependencyRatio: 46,
        hospitalStress: 51,
        isolationScore: 56,
        walkability: 42,
        environmentalScore: 51
      }
    }
  },
  {
    id: "kilkenny",
    name: "Kilkenny",
    county: "Kilkenny",
    population: 64000,
    coordinates: [52.6477, -7.2561],
    currentRisk: {
      overall: 39,
      factors: {
        dependencyRatio: 37,
        hospitalStress: 41,
        isolationScore: 45,
        walkability: 54,
        environmentalScore: 32
      }
    },
    futureRisk: {
      overall: 48,
      factors: {
        dependencyRatio: 44,
        hospitalStress: 48,
        isolationScore: 52,
        walkability: 50,
        environmentalScore: 39
      }
    }
  },
  {
    id: "tipperary",
    name: "Tipperary",
    county: "Tipperary",
    population: 81000,
    coordinates: [52.4738, -8.1565],
    currentRisk: {
      overall: 56,
      factors: {
        dependencyRatio: 51,
        hospitalStress: 47,
        isolationScore: 63,
        walkability: 41,
        environmentalScore: 55
      }
    },
    futureRisk: {
      overall: 65,
      factors: {
        dependencyRatio: 58,
        hospitalStress: 54,
        isolationScore: 70,
        walkability: 38,
        environmentalScore: 61
      }
    }
  }
];

export function searchDivisions(query: string): ElectoralDivision[] {
  if (!query) return divisions;
  
  const lowerQuery = query.toLowerCase();
  return divisions.filter(
    div => div.name.toLowerCase().includes(lowerQuery) || 
           div.county.toLowerCase().includes(lowerQuery)
  );
}

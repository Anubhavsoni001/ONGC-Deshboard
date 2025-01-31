import { NextResponse } from 'next/server';

// Simulate real-world data with random variations
function generateMetrics() {
  return {
    oilProduction: {
      current: 2.5 + (Math.random() * 0.2 - 0.1), // Million barrels per day
      target: 2.7,
      locations: {
        mumbaiHigh: 1.2 + (Math.random() * 0.1),
        krishnaGodavari: 0.8 + (Math.random() * 0.1),
        cauvery: 0.5 + (Math.random() * 0.1)
      }
    },
    gasProduction: {
      current: 23.4 + (Math.random() * 2 - 1), // Million Cubic Meters per day
      target: 25.0,
      locations: {
        mumbaiHigh: 10.2 + (Math.random() * 1),
        krishnaGodavari: 8.4 + (Math.random() * 1),
        cauvery: 4.8 + (Math.random() * 1)
      }
    },
    wellPressure: {
      average: 2340 + (Math.random() * 100 - 50),
      critical: Math.floor(Math.random() * 3),
      warning: Math.floor(Math.random() * 5)
    },
    wells: {
      total: 150,
      active: 142 - Math.floor(Math.random() * 3),
      maintenance: Math.floor(Math.random() * 8),
      drilling: Math.floor(Math.random() * 4)
    },
    environmentalMetrics: {
      carbonEmissions: 450 + (Math.random() * 20 - 10),
      waterUsage: 1200 + (Math.random() * 100 - 50),
      gasFlaring: 85 + (Math.random() * 10 - 5)
    },
    safetyMetrics: {
      daysWithoutIncident: 145,
      activeAlerts: Math.floor(Math.random() * 4),
      inspectionsDue: Math.floor(Math.random() * 6)
    }
  };
}

export async function GET() {
  const metrics = generateMetrics();
  return NextResponse.json(metrics);
}
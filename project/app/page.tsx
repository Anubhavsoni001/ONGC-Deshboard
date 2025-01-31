"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, Droplet, Flame, Gauge, BarChart3, AlertTriangle, Leaf, Shield } from "lucide-react";

type Metrics = {
  oilProduction: {
    current: number;
    target: number;
    locations: {
      mumbaiHigh: number;
      krishnaGodavari: number;
      cauvery: number;
    };
  };
  gasProduction: {
    current: number;
    target: number;
    locations: {
      mumbaiHigh: number;
      krishnaGodavari: number;
      cauvery: number;
    };
  };
  wellPressure: {
    average: number;
    critical: number;
    warning: number;
  };
  wells: {
    total: number;
    active: number;
    maintenance: number;
    drilling: number;
  };
  environmentalMetrics: {
    carbonEmissions: number;
    waterUsage: number;
    gasFlaring: number;
  };
  safetyMetrics: {
    daysWithoutIncident: number;
    activeAlerts: number;
    inspectionsDue: number;
  };
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [productionData, setProductionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    };

    // Initial fetch
    fetchMetrics();

    // Set up polling every 3 seconds
    const interval = setInterval(fetchMetrics, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (metrics) {
      setProductionData(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          oil: metrics.oilProduction.current,
          gas: metrics.gasProduction.current
        }
      ].slice(-6)); // Keep last 6 data points
    }
  }, [metrics]);

  if (!metrics) return <div>Loading...</div>;

  const locationData = [
    { name: 'Mumbai High', oil: metrics.oilProduction.locations.mumbaiHigh },
    { name: 'Krishna Godavari', oil: metrics.oilProduction.locations.krishnaGodavari },
    { name: 'Cauvery', oil: metrics.oilProduction.locations.cauvery }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">ONGC Monitoring Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">{metrics.safetyMetrics.activeAlerts} Active Alerts</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Droplet className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Oil Production</p>
                <p className="text-2xl font-bold">{metrics.oilProduction.current.toFixed(2)}M bbl/day</p>
                <p className="text-sm text-muted-foreground">Target: {metrics.oilProduction.target}M bbl/day</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Gas Production</p>
                <p className="text-2xl font-bold">{metrics.gasProduction.current.toFixed(1)} MCM/day</p>
                <p className="text-sm text-muted-foreground">Target: {metrics.gasProduction.target} MCM/day</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Gauge className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Well Pressure</p>
                <p className="text-2xl font-bold">{metrics.wellPressure.average.toFixed(0)} PSI</p>
                <p className="text-sm text-destructive">{metrics.wellPressure.critical} Critical</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Wells</p>
                <p className="text-2xl font-bold">{metrics.wells.active}/{metrics.wells.total}</p>
                <p className="text-sm text-muted-foreground">{metrics.wells.maintenance} in maintenance</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Environmental and Safety Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Environmental Metrics</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Carbon Emissions</p>
                <p className="text-xl font-bold">{metrics.environmentalMetrics.carbonEmissions.toFixed(1)} kt CO2e</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Water Usage</p>
                <p className="text-xl font-bold">{metrics.environmentalMetrics.waterUsage.toFixed(0)} m³/day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gas Flaring</p>
                <p className="text-xl font-bold">{metrics.environmentalMetrics.gasFlaring.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Safety Metrics</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Days Without Incident</p>
                <p className="text-xl font-bold">{metrics.safetyMetrics.daysWithoutIncident}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-xl font-bold text-destructive">{metrics.safetyMetrics.activeAlerts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inspections Due</p>
                <p className="text-xl font-bold text-yellow-500">{metrics.safetyMetrics.inspectionsDue}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="production" className="space-y-4">
          <TabsList>
            <TabsTrigger value="production">Production Overview</TabsTrigger>
            <TabsTrigger value="locations">Location Analysis</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-4">
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Real-time Production Trends</h2>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      padding={{ left: 0, right: 0 }}
                      tick={{ fill: 'currentColor' }}
                      stroke="currentColor"
                    />
                    <YAxis
                      padding={{ top: 20, bottom: 20 }}
                      tick={{ fill: 'currentColor' }}
                      stroke="currentColor"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="oil" 
                      stroke="hsl(var(--chart-1))" 
                      name="Oil Production"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gas" 
                      stroke="hsl(var(--chart-2))" 
                      name="Gas Production"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Production by Location</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="oil" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        dataKey="oil"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Maintenance Schedule</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-l-4 border-l-destructive">
                    <p className="font-medium">Well #A-123</p>
                    <p className="text-sm text-muted-foreground">Pressure Valve Replacement</p>
                    <p className="text-sm font-medium mt-2">Due: Today</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-yellow-500">
                    <p className="font-medium">Well #B-456</p>
                    <p className="text-sm text-muted-foreground">Regular Inspection</p>
                    <p className="text-sm font-medium mt-2">Due: Tomorrow</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-green-500">
                    <p className="font-medium">Well #C-789</p>
                    <p className="text-sm text-muted-foreground">Sensor Calibration</p>
                    <p className="text-sm font-medium mt-2">Due: Next Week</p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
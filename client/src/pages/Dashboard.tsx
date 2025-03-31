import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useDashboardData } from "@/hooks/useDashboardData";

import StatusCard from "@/components/dashboard/StatusCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DataTable from "@/components/dashboard/DataTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import LoadingOverlay from "@/components/dashboard/LoadingOverlay";

import { RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const { 
    metrics, 
    trafficData, 
    demographicsData, 
    deviceUsage, 
    conversionFunnel, 
    performanceData, 
    pageAnalytics,
    isLoading 
  } = useDashboardData(timeRange);

  // Set up SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource("/api/events");
    
    eventSource.addEventListener("connected", (e) => {
      console.log("SSE connected:", JSON.parse(e.data));
    });
    
    eventSource.addEventListener("metrics-update", (e) => {
      const newMetrics = JSON.parse(e.data);
      queryClient.setQueryData(['/api/metrics', timeRange], newMetrics);
      setLastUpdated(new Date().toLocaleTimeString());
    });
    
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };
    
    return () => {
      eventSource.close();
    };
  }, [queryClient, timeRange]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await apiRequest("POST", "/api/refresh", { timeRange });
      
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();
      
      setLastUpdated(new Date().toLocaleTimeString());
      toast({
        title: "Dashboard refreshed",
        description: "All data has been updated with the latest information.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing the dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Convert active users to formatted number
  const formatMetricValue = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  // Convert seconds to minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Analytics Dashboard</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
              Live
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-slate-500 hover:text-primary transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <TimeRangeSelector
              value={timeRange}
              onChange={handleTimeRangeChange}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-500 hover:text-primary transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="Active Users"
              value={metrics?.activeUsers ? formatMetricValue(metrics.activeUsers) : "--"}
              change={12}
              trend="up"
              icon="user"
              iconBgColor="bg-blue-50 dark:bg-blue-950"
              iconColor="text-primary dark:text-blue-400"
            />
            
            <StatusCard
              title="Page Views"
              value={metrics?.pageViews ? formatMetricValue(metrics.pageViews) : "--"}
              change={8.3}
              trend="up"
              icon="eye"
              iconBgColor="bg-purple-50 dark:bg-purple-950"
              iconColor="text-accent dark:text-purple-400"
            />
            
            <StatusCard
              title="Conversion Rate"
              value={metrics?.conversionRate ? `${metrics.conversionRate}%` : "--"}
              change={1.8}
              trend="down"
              icon="percent"
              iconBgColor="bg-green-50 dark:bg-green-950"
              iconColor="text-green-600 dark:text-green-400"
            />
            
            <StatusCard
              title="Avg. Session"
              value={metrics?.avgSessionDuration ? formatTime(metrics.avgSessionDuration) : "--"}
              change={0.5}
              trend="up"
              icon="timer"
              iconBgColor="bg-blue-50 dark:bg-blue-950"
              iconColor="text-info dark:text-blue-300"
            />
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard
              title="Traffic Overview"
              className="lg:col-span-2"
              type="line"
              data={trafficData}
              showFilter={true}
            />
            
            <ChartCard
              title="User Demographics"
              type="bar"
              data={demographicsData}
            />
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard
              title="Device Usage"
              type="doughnut"
              data={deviceUsage}
              height={250}
            />
            
            <ChartCard
              title="Conversion Funnel"
              type="horizontalBar"
              data={conversionFunnel}
              height={250}
            />
            
            <ChartCard
              title="Page Load Time"
              type="line"
              data={performanceData}
              height={250}
            />
          </div>

          {/* Data Table */}
          <DataTable
            title="Top Pages"
            data={pageAnalytics || []}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © 2023 Dashboard Analytics. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: <span>{lastUpdated}</span></p>
            </div>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message="Loading dashboard data..." />}
      {isRefreshing && <LoadingOverlay message="Updating dashboard..." />}
    </div>
  );
};

export default Dashboard;

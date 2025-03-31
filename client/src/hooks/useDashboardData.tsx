import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  Metrics,
  PageAnalytics,
  DeviceUsage,
  TrafficData,
  DemographicsData,
  ConversionFunnel,
  PerformanceData
} from "@shared/schema";

export function useDashboardData(timeRange: string = "24h") {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch metrics based on timeRange
  const { data: metrics } = useQuery<Metrics>({
    queryKey: ['/api/metrics', timeRange],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch page analytics
  const { data: pageAnalytics } = useQuery<PageAnalytics[]>({
    queryKey: ['/api/page-analytics'],
    refetchInterval: 30000,
  });

  // Fetch device usage
  const { data: deviceUsageRaw } = useQuery<DeviceUsage>({
    queryKey: ['/api/device-usage'],
    refetchInterval: 30000,
  });

  // Fetch traffic data
  const { data: trafficDataRaw } = useQuery<TrafficData[]>({
    queryKey: ['/api/traffic-data'],
    refetchInterval: 30000,
  });

  // Fetch demographics data
  const { data: demographicsDataRaw } = useQuery<DemographicsData[]>({
    queryKey: ['/api/demographics-data'],
    refetchInterval: 30000,
  });

  // Fetch conversion funnel
  const { data: conversionFunnelRaw } = useQuery<ConversionFunnel[]>({
    queryKey: ['/api/conversion-funnel'],
    refetchInterval: 30000,
  });

  // Fetch performance data
  const { data: performanceDataRaw } = useQuery<PerformanceData[]>({
    queryKey: ['/api/performance-data'],
    refetchInterval: 30000,
  });

  // Process device usage data for chart.js
  const deviceUsage = deviceUsageRaw ? {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [deviceUsageRaw.desktop, deviceUsageRaw.mobile, deviceUsageRaw.tablet],
      backgroundColor: ['#2563eb', '#7c3aed', '#64748b'],
      borderWidth: 0,
      borderRadius: 4
    }]
  } : null;

  // Process traffic data for chart.js
  const trafficData = trafficDataRaw ? {
    labels: trafficDataRaw.map(item => item.label),
    datasets: [
      {
        label: 'Current Period',
        data: trafficDataRaw.map(item => item.current),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointRadius: 3,
        pointHoverRadius: 5
      },
      {
        label: 'Previous Period',
        data: trafficDataRaw.map(item => item.previous),
        borderColor: '#64748b',
        borderDash: [5, 5],
        tension: 0.4,
        backgroundColor: 'transparent',
        pointBackgroundColor: '#64748b',
        pointRadius: 2,
        pointHoverRadius: 4
      }
    ]
  } : null;

  // Process demographics data for chart.js
  const demographicsData = demographicsDataRaw ? {
    labels: demographicsDataRaw.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Male',
        data: demographicsDataRaw.map(item => item.male),
        backgroundColor: '#2563eb',
        barPercentage: 0.6,
        categoryPercentage: 0.5
      },
      {
        label: 'Female',
        data: demographicsDataRaw.map(item => item.female),
        backgroundColor: '#7c3aed',
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }
    ]
  } : null;

  // Process conversion funnel data for chart.js
  const conversionFunnel = conversionFunnelRaw ? {
    labels: conversionFunnelRaw.map(item => item.stage),
    datasets: [{
      label: 'Conversion Steps',
      data: conversionFunnelRaw.map(item => item.value),
      backgroundColor: [
        '#94a3b8', 
        '#64748b', 
        '#475569', 
        '#334155', 
        '#22c55e'
      ],
      borderWidth: 0,
      borderRadius: 4
    }]
  } : null;

  // Process performance data for chart.js
  const performanceData = performanceDataRaw ? {
    labels: performanceDataRaw.map(item => item.day),
    datasets: [{
      label: 'Page Load (ms)',
      data: performanceDataRaw.map(item => item.loadTime),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ef4444',
      pointRadius: 3,
      pointHoverRadius: 5
    }]
  } : null;

  // Determine overall loading state
  useEffect(() => {
    if (
      metrics &&
      pageAnalytics &&
      deviceUsageRaw &&
      trafficDataRaw &&
      demographicsDataRaw &&
      conversionFunnelRaw &&
      performanceDataRaw
    ) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [
    metrics,
    pageAnalytics,
    deviceUsageRaw,
    trafficDataRaw,
    demographicsDataRaw,
    conversionFunnelRaw,
    performanceDataRaw,
  ]);

  return {
    metrics,
    pageAnalytics,
    deviceUsage,
    trafficData,
    demographicsData,
    conversionFunnel,
    performanceData,
    isLoading,
  };
}

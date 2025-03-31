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

  // Buscar métricas com base no intervalo de tempo
  const { data: metrics } = useQuery<Metrics>({
    queryKey: ['/api/metrics', timeRange],
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Buscar análise de páginas
  const { data: pageAnalytics } = useQuery<PageAnalytics[]>({
    queryKey: ['/api/page-analytics'],
    refetchInterval: 30000,
  });

  // Buscar uso por dispositivo
  const { data: deviceUsageRaw } = useQuery<DeviceUsage>({
    queryKey: ['/api/device-usage'],
    refetchInterval: 30000,
  });

  // Buscar dados de tráfego
  const { data: trafficDataRaw } = useQuery<TrafficData[]>({
    queryKey: ['/api/traffic-data'],
    refetchInterval: 30000,
  });

  // Buscar dados demográficos
  const { data: demographicsDataRaw } = useQuery<DemographicsData[]>({
    queryKey: ['/api/demographics-data'],
    refetchInterval: 30000,
  });

  // Buscar funil de conversão
  const { data: conversionFunnelRaw } = useQuery<ConversionFunnel[]>({
    queryKey: ['/api/conversion-funnel'],
    refetchInterval: 30000,
  });

  // Buscar dados de desempenho
  const { data: performanceDataRaw } = useQuery<PerformanceData[]>({
    queryKey: ['/api/performance-data'],
    refetchInterval: 30000,
  });

  // Processar dados de uso por dispositivo para chart.js
  const deviceUsage = deviceUsageRaw ? {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [deviceUsageRaw.desktop, deviceUsageRaw.mobile, deviceUsageRaw.tablet],
      backgroundColor: ['#2563eb', '#7c3aed', '#64748b'],
      borderWidth: 0,
      borderRadius: 4
    }]
  } : null;

  // Processar dados de tráfego para chart.js
  const trafficData = trafficDataRaw ? {
    labels: trafficDataRaw.map(item => item.label),
    datasets: [
      {
        label: 'Período Atual',
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
        label: 'Período Anterior',
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

  // Processar dados demográficos para chart.js
  const demographicsData = demographicsDataRaw ? {
    labels: demographicsDataRaw.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Masculino',
        data: demographicsDataRaw.map(item => item.male),
        backgroundColor: '#2563eb',
        barPercentage: 0.6,
        categoryPercentage: 0.5
      },
      {
        label: 'Feminino',
        data: demographicsDataRaw.map(item => item.female),
        backgroundColor: '#7c3aed',
        barPercentage: 0.6,
        categoryPercentage: 0.5
      }
    ]
  } : null;

  // Processar dados do funil de conversão para chart.js
  const conversionFunnel = conversionFunnelRaw ? {
    labels: conversionFunnelRaw.map(item => item.stage),
    datasets: [{
      label: 'Etapas de Conversão',
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

  // Processar dados de desempenho para chart.js
  const performanceData = performanceDataRaw ? {
    labels: performanceDataRaw.map(item => item.day),
    datasets: [{
      label: 'Tempo de Carregamento (ms)',
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

  // Determinar estado de carregamento geral
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

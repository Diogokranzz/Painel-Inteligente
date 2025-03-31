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

  // Configuração da conexão SSE para atualizações em tempo real
  useEffect(() => {
    const eventSource = new EventSource("/api/events");
    
    eventSource.addEventListener("connected", (e) => {
      console.log("SSE conectado:", JSON.parse(e.data));
    });
    
    eventSource.addEventListener("metrics-update", (e) => {
      const newMetrics = JSON.parse(e.data);
      queryClient.setQueryData(['/api/metrics', timeRange], newMetrics);
      setLastUpdated(new Date().toLocaleTimeString());
    });
    
    eventSource.onerror = (error) => {
      console.error("Erro SSE:", error);
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
      
      // Invalidar todas as consultas para atualizar os dados
      await queryClient.invalidateQueries();
      
      setLastUpdated(new Date().toLocaleTimeString());
      toast({
        title: "Painel atualizado",
        description: "Todos os dados foram atualizados com as informações mais recentes.",
      });
    } catch (error) {
      toast({
        title: "Falha na atualização",
        description: "Ocorreu um erro ao atualizar os dados do painel.",
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

  // Converte usuários ativos para número formatado
  const formatMetricValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Converte segundos para minutos e segundos
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {/* Cabeçalho */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Visão 360° - Painel Inteligente</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
              Ao vivo
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

      {/* Conteúdo Principal */}
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto">
          {/* Cartões de Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatusCard
              title="Usuários Ativos"
              value={metrics?.activeUsers ? formatMetricValue(metrics.activeUsers) : "--"}
              change={12}
              trend="up"
              icon="user"
              iconBgColor="bg-blue-50 dark:bg-blue-950"
              iconColor="text-primary dark:text-blue-400"
            />
            
            <StatusCard
              title="Visualizações"
              value={metrics?.pageViews ? formatMetricValue(metrics.pageViews) : "--"}
              change={8.3}
              trend="up"
              icon="eye"
              iconBgColor="bg-purple-50 dark:bg-purple-950"
              iconColor="text-accent dark:text-purple-400"
            />
            
            <StatusCard
              title="Taxa de Conversão"
              value={metrics?.conversionRate ? `${metrics.conversionRate}%` : "--"}
              change={1.8}
              trend="down"
              icon="percent"
              iconBgColor="bg-green-50 dark:bg-green-950"
              iconColor="text-green-600 dark:text-green-400"
            />
            
            <StatusCard
              title="Sessão Média"
              value={metrics?.avgSessionDuration ? formatTime(metrics.avgSessionDuration) : "--"}
              change={0.5}
              trend="up"
              icon="timer"
              iconBgColor="bg-blue-50 dark:bg-blue-950"
              iconColor="text-info dark:text-blue-300"
            />
          </div>

          {/* Gráficos Principais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard
              title="Visão Geral de Tráfego"
              className="lg:col-span-2"
              type="line"
              data={trafficData}
              showFilter={true}
            />
            
            <ChartCard
              title="Demografia de Usuários"
              type="bar"
              data={demographicsData}
            />
          </div>

          {/* Gráficos Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <ChartCard
              title="Uso por Dispositivo"
              type="doughnut"
              data={deviceUsage}
              height={250}
            />
            
            <ChartCard
              title="Funil de Conversão"
              type="horizontalBar"
              data={conversionFunnel}
              height={250}
            />
            
            <ChartCard
              title="Tempo de Carregamento"
              type="line"
              data={performanceData}
              height={250}
            />
          </div>

          {/* Tabela de Dados */}
          <DataTable
            title="Páginas Principais"
            data={pageAnalytics || []}
          />
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © 2023 Visão 360° - Painel Inteligente. Todos os direitos reservados.
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-slate-500 dark:text-slate-400">Última atualização: <span>{lastUpdated}</span></p>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlay de Carregamento */}
      {isLoading && <LoadingOverlay message="Carregando dados do painel..." />}
      {isRefreshing && <LoadingOverlay message="Atualizando painel..." />}
    </div>
  );
};

export default Dashboard;

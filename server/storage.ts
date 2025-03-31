import {
  User,
  InsertUser,
  Metrics,
  InsertMetrics,
  PageAnalytics,
  InsertPageAnalytics,
  DeviceUsage,
  InsertDeviceUsage,
  TrafficData,
  InsertTrafficData,
  DemographicsData,
  InsertDemographicsData,
  ConversionFunnel,
  InsertConversionFunnel,
  PerformanceData,
  InsertPerformanceData
} from "@shared/schema";

// Interface para todas as operações de armazenamento
export interface IStorage {
  // Operações de usuário
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Operações de métricas do painel
  getLatestMetrics(timeRange: string): Promise<Metrics | undefined>;
  createMetrics(metrics: InsertMetrics): Promise<Metrics>;
  
  // Operações de análise de páginas
  getAllPageAnalytics(): Promise<PageAnalytics[]>;
  createPageAnalytics(pageAnalytics: InsertPageAnalytics): Promise<PageAnalytics>;
  
  // Operações de uso por dispositivo
  getLatestDeviceUsage(): Promise<DeviceUsage | undefined>;
  createDeviceUsage(deviceUsage: InsertDeviceUsage): Promise<DeviceUsage>;
  
  // Operações de dados de tráfego
  getAllTrafficData(): Promise<TrafficData[]>;
  createTrafficData(trafficData: InsertTrafficData): Promise<TrafficData>;
  
  // Operações de dados demográficos
  getAllDemographicsData(): Promise<DemographicsData[]>;
  createDemographicsData(demographicsData: InsertDemographicsData): Promise<DemographicsData>;
  
  // Operações de funil de conversão
  getAllConversionFunnel(): Promise<ConversionFunnel[]>;
  createConversionFunnel(conversionFunnel: InsertConversionFunnel): Promise<ConversionFunnel>;
  
  // Operações de dados de desempenho
  getAllPerformanceData(): Promise<PerformanceData[]>;
  createPerformanceData(performanceData: InsertPerformanceData): Promise<PerformanceData>;

  // Métodos adicionais para atualizações do painel
  generateRandomMetricsUpdate(timeRange: string): Promise<Metrics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private metrics: Map<number, Metrics>;
  private pageAnalytics: Map<number, PageAnalytics>;
  private deviceUsage: Map<number, DeviceUsage>;
  private trafficData: Map<number, TrafficData>;
  private demographicsData: Map<number, DemographicsData>;
  private conversionFunnel: Map<number, ConversionFunnel>;
  private performanceData: Map<number, PerformanceData>;
  
  private currentUserId: number;
  private currentMetricsId: number;
  private currentPageAnalyticsId: number;
  private currentDeviceUsageId: number;
  private currentTrafficDataId: number;
  private currentDemographicsDataId: number;
  private currentConversionFunnelId: number;
  private currentPerformanceDataId: number;

  constructor() {
    this.users = new Map();
    this.metrics = new Map();
    this.pageAnalytics = new Map();
    this.deviceUsage = new Map();
    this.trafficData = new Map();
    this.demographicsData = new Map();
    this.conversionFunnel = new Map();
    this.performanceData = new Map();
    
    this.currentUserId = 1;
    this.currentMetricsId = 1;
    this.currentPageAnalyticsId = 1;
    this.currentDeviceUsageId = 1;
    this.currentTrafficDataId = 1;
    this.currentDemographicsDataId = 1;
    this.currentConversionFunnelId = 1;
    this.currentPerformanceDataId = 1;
    
    // Inicializar com dados de exemplo
    this.initializeData();
  }

  // Métodos de usuário
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Métodos de métricas do painel
  async getLatestMetrics(timeRange: string): Promise<Metrics | undefined> {
    const allMetrics = Array.from(this.metrics.values());
    return allMetrics
      .filter(metric => metric.timeRange === timeRange)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const id = this.currentMetricsId++;
    const metrics: Metrics = { ...insertMetrics, id };
    this.metrics.set(id, metrics);
    return metrics;
  }

  // Métodos de análise de páginas
  async getAllPageAnalytics(): Promise<PageAnalytics[]> {
    return Array.from(this.pageAnalytics.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createPageAnalytics(insertPageAnalytics: InsertPageAnalytics): Promise<PageAnalytics> {
    const id = this.currentPageAnalyticsId++;
    const pageAnalytics: PageAnalytics = { ...insertPageAnalytics, id };
    this.pageAnalytics.set(id, pageAnalytics);
    return pageAnalytics;
  }

  // Métodos de uso por dispositivo
  async getLatestDeviceUsage(): Promise<DeviceUsage | undefined> {
    const allDeviceUsage = Array.from(this.deviceUsage.values());
    return allDeviceUsage.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }

  async createDeviceUsage(insertDeviceUsage: InsertDeviceUsage): Promise<DeviceUsage> {
    const id = this.currentDeviceUsageId++;
    const deviceUsage: DeviceUsage = { ...insertDeviceUsage, id };
    this.deviceUsage.set(id, deviceUsage);
    return deviceUsage;
  }

  // Métodos de dados de tráfego
  async getAllTrafficData(): Promise<TrafficData[]> {
    return Array.from(this.trafficData.values())
      .sort((a, b) => a.id - b.id); // Ordenar por ID para manter a ordem
  }

  async createTrafficData(insertTrafficData: InsertTrafficData): Promise<TrafficData> {
    const id = this.currentTrafficDataId++;
    const trafficData: TrafficData = { ...insertTrafficData, id };
    this.trafficData.set(id, trafficData);
    return trafficData;
  }

  // Métodos de dados demográficos
  async getAllDemographicsData(): Promise<DemographicsData[]> {
    return Array.from(this.demographicsData.values())
      .sort((a, b) => a.id - b.id); // Ordenar por ID para manter a ordem
  }

  async createDemographicsData(insertDemographicsData: InsertDemographicsData): Promise<DemographicsData> {
    const id = this.currentDemographicsDataId++;
    const demographicsData: DemographicsData = { ...insertDemographicsData, id };
    this.demographicsData.set(id, demographicsData);
    return demographicsData;
  }

  // Métodos de funil de conversão
  async getAllConversionFunnel(): Promise<ConversionFunnel[]> {
    return Array.from(this.conversionFunnel.values())
      .sort((a, b) => a.id - b.id); // Ordenar por ID para manter a ordem
  }

  async createConversionFunnel(insertConversionFunnel: InsertConversionFunnel): Promise<ConversionFunnel> {
    const id = this.currentConversionFunnelId++;
    const conversionFunnel: ConversionFunnel = { ...insertConversionFunnel, id };
    this.conversionFunnel.set(id, conversionFunnel);
    return conversionFunnel;
  }

  // Métodos de dados de desempenho
  async getAllPerformanceData(): Promise<PerformanceData[]> {
    return Array.from(this.performanceData.values())
      .sort((a, b) => a.id - b.id); // Ordenar por ID para manter a ordem
  }

  async createPerformanceData(insertPerformanceData: InsertPerformanceData): Promise<PerformanceData> {
    const id = this.currentPerformanceDataId++;
    const performanceData: PerformanceData = { ...insertPerformanceData, id };
    this.performanceData.set(id, performanceData);
    return performanceData;
  }

  // Método para gerar atualizações aleatórias de métricas para dados em tempo real
  async generateRandomMetricsUpdate(timeRange: string): Promise<Metrics> {
    const lastMetrics = await this.getLatestMetrics(timeRange);
    let baseActiveUsers = 1200;
    let basePageViews = 30000;
    let baseConversionRate = 3.5;
    let baseAvgSessionDuration = 260; // 4m 20s
    
    if (lastMetrics) {
      baseActiveUsers = Number(lastMetrics.activeUsers);
      basePageViews = Number(lastMetrics.pageViews);
      baseConversionRate = Number(lastMetrics.conversionRate);
      baseAvgSessionDuration = Number(lastMetrics.avgSessionDuration);
    }
    
    // Gerar flutuações aleatórias
    const activeUsers = Math.max(500, baseActiveUsers + Math.floor((Math.random() - 0.5) * 100));
    const pageViews = Math.max(5000, basePageViews + Math.floor((Math.random() - 0.5) * 1000));
    const conversionRate = Math.max(0.5, Number(baseConversionRate) + (Math.random() - 0.5) * 0.2);
    const avgSessionDuration = Math.max(60, baseAvgSessionDuration + Math.floor((Math.random() - 0.5) * 20));
    
    const updatedMetrics: InsertMetrics = {
      timestamp: new Date(),
      activeUsers,
      pageViews,
      conversionRate,
      avgSessionDuration,
      timeRange,
    };
    
    return this.createMetrics(updatedMetrics);
  }
  
  // Inicializar com dados realistas
  private initializeData() {
    // Métricas iniciais para diferentes intervalos de tempo
    const timeRanges = ["1h", "6h", "24h", "7d", "30d"];
    timeRanges.forEach(range => {
      this.createMetrics({
        timestamp: new Date(),
        activeUsers: 1256,
        pageViews: 32489,
        conversionRate: 3.6,
        avgSessionDuration: 263, // 4m 23s
        timeRange: range,
      });
    });
    
    // Análise inicial de páginas
    const pageData = [
      {
        pagePath: "/home",
        views: 12543,
        uniqueViews: 8721,
        bounceRate: 32.4,
        avgTime: 133, // 2m 13s
      },
      {
        pagePath: "/products",
        views: 8427,
        uniqueViews: 6382,
        bounceRate: 28.7,
        avgTime: 222, // 3m 42s
      },
      {
        pagePath: "/blog",
        views: 5372,
        uniqueViews: 4128,
        bounceRate: 41.2,
        avgTime: 257, // 4m 17s
      },
      {
        pagePath: "/checkout",
        views: 3241,
        uniqueViews: 2986,
        bounceRate: 12.8,
        avgTime: 174, // 2m 54s
      },
      {
        pagePath: "/about",
        views: 2879,
        uniqueViews: 2124,
        bounceRate: 52.3,
        avgTime: 92, // 1m 32s
      },
    ];
    
    pageData.forEach(page => {
      this.createPageAnalytics({
        ...page,
        timestamp: new Date(),
      });
    });
    
    // Uso inicial por dispositivo
    this.createDeviceUsage({
      desktop: 45,
      mobile: 40,
      tablet: 15,
      timestamp: new Date(),
    });
    
    // Dados iniciais de tráfego
    const trafficLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    const currentTraffic = [120, 190, 300, 510, 620, 780, 880, 730];
    const previousTraffic = [90, 150, 260, 420, 560, 680, 750, 650];
    
    trafficLabels.forEach((label, index) => {
      this.createTrafficData({
        label,
        current: currentTraffic[index],
        previous: previousTraffic[index],
        timestamp: new Date(),
      });
    });
    
    // Dados iniciais demográficos
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
    const maleData = [15, 30, 25, 18, 12, 8];
    const femaleData = [18, 34, 27, 15, 10, 6];
    
    ageGroups.forEach((ageGroup, index) => {
      this.createDemographicsData({
        ageGroup,
        male: maleData[index],
        female: femaleData[index],
        timestamp: new Date(),
      });
    });
    
    // Funil de conversão inicial
    const funnelStages = ['Visitantes', 'Visualizações', 'Adição ao Carrinho', 'Checkout', 'Compra'];
    const funnelValues = [10000, 8200, 4300, 2100, 1200];
    
    funnelStages.forEach((stage, index) => {
      this.createConversionFunnel({
        stage,
        value: funnelValues[index],
        timestamp: new Date(),
      });
    });
    
    // Dados iniciais de desempenho
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const loadTimes = [320, 380, 275, 290, 310, 260, 295];
    
    days.forEach((day, index) => {
      this.createPerformanceData({
        day,
        loadTime: loadTimes[index],
        timestamp: new Date(),
      });
    });
  }
}

export const storage = new MemStorage();

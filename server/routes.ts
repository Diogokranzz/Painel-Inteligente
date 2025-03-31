import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Set up Server-Sent Events for real-time updates
const CLIENTS: Response[] = [];

// Function to send data to all connected clients
function sendEventToAll(event: string, data: any) {
  CLIENTS.forEach((client) => {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Obter métricas do painel
  app.get("/api/metrics", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as string || "24h";
      const metrics = await storage.getLatestMetrics(timeRange);
      res.json(metrics);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      res.status(500).json({ message: "Falha ao obter métricas" });
    }
  });

  // Obter todas as análises de página
  app.get("/api/page-analytics", async (req, res) => {
    try {
      const pageAnalytics = await storage.getAllPageAnalytics();
      res.json(pageAnalytics);
    } catch (error) {
      console.error("Erro ao buscar análises de página:", error);
      res.status(500).json({ message: "Falha ao obter análises de página" });
    }
  });

  // Obter uso por dispositivo
  app.get("/api/device-usage", async (req, res) => {
    try {
      const deviceUsage = await storage.getLatestDeviceUsage();
      res.json(deviceUsage);
    } catch (error) {
      console.error("Erro ao buscar uso por dispositivo:", error);
      res.status(500).json({ message: "Falha ao obter uso por dispositivo" });
    }
  });

  // Obter dados de tráfego
  app.get("/api/traffic-data", async (req, res) => {
    try {
      const trafficData = await storage.getAllTrafficData();
      res.json(trafficData);
    } catch (error) {
      console.error("Erro ao buscar dados de tráfego:", error);
      res.status(500).json({ message: "Falha ao obter dados de tráfego" });
    }
  });

  // Obter dados demográficos
  app.get("/api/demographics-data", async (req, res) => {
    try {
      const demographicsData = await storage.getAllDemographicsData();
      res.json(demographicsData);
    } catch (error) {
      console.error("Erro ao buscar dados demográficos:", error);
      res.status(500).json({ message: "Falha ao obter dados demográficos" });
    }
  });

  // Obter funil de conversão
  app.get("/api/conversion-funnel", async (req, res) => {
    try {
      const conversionFunnel = await storage.getAllConversionFunnel();
      res.json(conversionFunnel);
    } catch (error) {
      console.error("Erro ao buscar funil de conversão:", error);
      res.status(500).json({ message: "Falha ao obter funil de conversão" });
    }
  });

  // Obter dados de desempenho
  app.get("/api/performance-data", async (req, res) => {
    try {
      const performanceData = await storage.getAllPerformanceData();
      res.json(performanceData);
    } catch (error) {
      console.error("Erro ao buscar dados de desempenho:", error);
      res.status(500).json({ message: "Falha ao obter dados de desempenho" });
    }
  });

  // Atualizar dados do painel
  app.post("/api/refresh", async (req, res) => {
    try {
      const timeRange = req.body.timeRange || "24h";
      const metrics = await storage.generateRandomMetricsUpdate(timeRange);
      
      // Atualizar todos os clientes conectados
      sendEventToAll("metrics-update", metrics);
      
      res.json({ success: true, metrics });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      res.status(500).json({ message: "Falha ao atualizar dados" });
    }
  });

  // Endpoint para Server-Sent Events
  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // Enviar evento inicial de conexão estabelecida
    res.write("event: connected\n");
    res.write(`data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
    
    // Adicionar cliente à lista
    CLIENTS.push(res);
    
    // Tratar desconexão do cliente
    req.on("close", () => {
      const index = CLIENTS.indexOf(res);
      if (index !== -1) {
        CLIENTS.splice(index, 1);
      }
    });
  });

  // Iniciar atualizações periódicas (a cada 30 segundos)
  setInterval(async () => {
    try {
      const metrics = await storage.generateRandomMetricsUpdate("24h");
      sendEventToAll("metrics-update", metrics);
    } catch (error) {
      console.error("Erro na atualização periódica:", error);
    }
  }, 30000);

  const httpServer = createServer(app);
  return httpServer;
}

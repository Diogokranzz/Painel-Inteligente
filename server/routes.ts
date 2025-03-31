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
  // Get dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const timeRange = req.query.timeRange as string || "24h";
      const metrics = await storage.getLatestMetrics(timeRange);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Get all page analytics
  app.get("/api/page-analytics", async (req, res) => {
    try {
      const pageAnalytics = await storage.getAllPageAnalytics();
      res.json(pageAnalytics);
    } catch (error) {
      console.error("Error fetching page analytics:", error);
      res.status(500).json({ message: "Failed to fetch page analytics" });
    }
  });

  // Get device usage
  app.get("/api/device-usage", async (req, res) => {
    try {
      const deviceUsage = await storage.getLatestDeviceUsage();
      res.json(deviceUsage);
    } catch (error) {
      console.error("Error fetching device usage:", error);
      res.status(500).json({ message: "Failed to fetch device usage" });
    }
  });

  // Get traffic data
  app.get("/api/traffic-data", async (req, res) => {
    try {
      const trafficData = await storage.getAllTrafficData();
      res.json(trafficData);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  // Get demographics data
  app.get("/api/demographics-data", async (req, res) => {
    try {
      const demographicsData = await storage.getAllDemographicsData();
      res.json(demographicsData);
    } catch (error) {
      console.error("Error fetching demographics data:", error);
      res.status(500).json({ message: "Failed to fetch demographics data" });
    }
  });

  // Get conversion funnel
  app.get("/api/conversion-funnel", async (req, res) => {
    try {
      const conversionFunnel = await storage.getAllConversionFunnel();
      res.json(conversionFunnel);
    } catch (error) {
      console.error("Error fetching conversion funnel:", error);
      res.status(500).json({ message: "Failed to fetch conversion funnel" });
    }
  });

  // Get performance data
  app.get("/api/performance-data", async (req, res) => {
    try {
      const performanceData = await storage.getAllPerformanceData();
      res.json(performanceData);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  // Refresh dashboard data
  app.post("/api/refresh", async (req, res) => {
    try {
      const timeRange = req.body.timeRange || "24h";
      const metrics = await storage.generateRandomMetricsUpdate(timeRange);
      
      // Update all connected clients
      sendEventToAll("metrics-update", metrics);
      
      res.json({ success: true, metrics });
    } catch (error) {
      console.error("Error refreshing data:", error);
      res.status(500).json({ message: "Failed to refresh data" });
    }
  });

  // Server-Sent Events endpoint
  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // Send initial connection established event
    res.write("event: connected\n");
    res.write(`data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
    
    // Add client to the list
    CLIENTS.push(res);
    
    // Handle client disconnect
    req.on("close", () => {
      const index = CLIENTS.indexOf(res);
      if (index !== -1) {
        CLIENTS.splice(index, 1);
      }
    });
  });

  // Start periodic updates (every 30 seconds)
  setInterval(async () => {
    try {
      const metrics = await storage.generateRandomMetricsUpdate("24h");
      sendEventToAll("metrics-update", metrics);
    } catch (error) {
      console.error("Error in periodic update:", error);
    }
  }, 30000);

  const httpServer = createServer(app);
  return httpServer;
}

import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - keeping the default
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Dashboard metrics
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  activeUsers: integer("active_users").notNull(),
  pageViews: integer("page_views").notNull(),
  conversionRate: numeric("conversion_rate").notNull(),
  avgSessionDuration: integer("avg_session_duration").notNull(), // in seconds
  timeRange: text("time_range").notNull(),
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
});

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;

// Page analytics
export const pageAnalytics = pgTable("page_analytics", {
  id: serial("id").primaryKey(),
  pagePath: text("page_path").notNull(),
  views: integer("views").notNull(),
  uniqueViews: integer("unique_views").notNull(),
  bounceRate: numeric("bounce_rate").notNull(),
  avgTime: integer("avg_time").notNull(), // in seconds
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertPageAnalyticsSchema = createInsertSchema(pageAnalytics).omit({
  id: true,
});

export type InsertPageAnalytics = z.infer<typeof insertPageAnalyticsSchema>;
export type PageAnalytics = typeof pageAnalytics.$inferSelect;

// Device usage
export const deviceUsage = pgTable("device_usage", {
  id: serial("id").primaryKey(),
  desktop: numeric("desktop").notNull(),
  mobile: numeric("mobile").notNull(),
  tablet: numeric("tablet").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertDeviceUsageSchema = createInsertSchema(deviceUsage).omit({
  id: true,
});

export type InsertDeviceUsage = z.infer<typeof insertDeviceUsageSchema>;
export type DeviceUsage = typeof deviceUsage.$inferSelect;

// Traffic data
export const trafficData = pgTable("traffic_data", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  current: integer("current").notNull(),
  previous: integer("previous").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTrafficDataSchema = createInsertSchema(trafficData).omit({
  id: true,
});

export type InsertTrafficData = z.infer<typeof insertTrafficDataSchema>;
export type TrafficData = typeof trafficData.$inferSelect;

// Demographics data
export const demographicsData = pgTable("demographics_data", {
  id: serial("id").primaryKey(),
  ageGroup: text("age_group").notNull(),
  male: integer("male").notNull(),
  female: integer("female").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertDemographicsDataSchema = createInsertSchema(demographicsData).omit({
  id: true,
});

export type InsertDemographicsData = z.infer<typeof insertDemographicsDataSchema>;
export type DemographicsData = typeof demographicsData.$inferSelect;

// Conversion funnel
export const conversionFunnel = pgTable("conversion_funnel", {
  id: serial("id").primaryKey(),
  stage: text("stage").notNull(),
  value: integer("value").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertConversionFunnelSchema = createInsertSchema(conversionFunnel).omit({
  id: true,
});

export type InsertConversionFunnel = z.infer<typeof insertConversionFunnelSchema>;
export type ConversionFunnel = typeof conversionFunnel.$inferSelect;

// Performance data
export const performanceData = pgTable("performance_data", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  loadTime: integer("load_time").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertPerformanceDataSchema = createInsertSchema(performanceData).omit({
  id: true,
});

export type InsertPerformanceData = z.infer<typeof insertPerformanceDataSchema>;
export type PerformanceData = typeof performanceData.$inferSelect;

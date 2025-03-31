import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createChart } from "@/lib/chartUtils";

interface ChartCardProps {
  title: string;
  type: "line" | "bar" | "doughnut" | "horizontalBar";
  data: any;
  height?: number;
  className?: string;
  showFilter?: boolean;
}

const ChartCard = ({
  title,
  type,
  data,
  height = 350,
  className = "",
  showFilter = false,
}: ChartCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>("daily");

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    // Clean up previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      chartRef.current = createChart(ctx, type, data, activeFilter);
    }

    // Clean up on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <Card className={`border border-slate-200 dark:border-slate-700 ${className}`}>
      <CardHeader className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </CardTitle>
        {showFilter ? (
          <div className="flex gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1 text-sm">
              <Button
                variant={activeFilter === "daily" ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "daily"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
                onClick={() => handleFilterChange("daily")}
              >
                Daily
              </Button>
              <Button
                variant={activeFilter === "weekly" ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "weekly"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
                onClick={() => handleFilterChange("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={activeFilter === "monthly" ? "default" : "ghost"}
                size="sm"
                className={`px-3 py-1 rounded-md ${
                  activeFilter === "monthly"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
                onClick={() => handleFilterChange("monthly")}
              >
                Monthly
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className={`h-[${height}px] relative`} style={{ height: `${height}px` }}>
          {data ? (
            <canvas ref={canvasRef} />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500">
              Loading data...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;

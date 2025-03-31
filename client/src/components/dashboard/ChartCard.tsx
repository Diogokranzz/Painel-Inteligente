import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createChart } from "@/lib/chartUtils";
import AnimatedCard from "./AnimatedCard";
import AnimatedIcon from "./AnimatedIcon";

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
  const [isChartVisible, setIsChartVisible] = useState(false);

  // Determinar o ícone com base no tipo de gráfico
  const chartIconType = type === "line" 
    ? "line" 
    : type === "bar" || type === "horizontalBar" 
      ? "chart" 
      : "pie";

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    // Limpar instância anterior do gráfico
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Criar novo gráfico
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      chartRef.current = createChart(ctx, type, data, activeFilter);
      
      // Adicionar um pequeno atraso para a animação do gráfico
      setTimeout(() => {
        setIsChartVisible(true);
      }, 100);
    }

    // Limpar ao desmontar
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setIsChartVisible(false); // Esconder o gráfico durante a mudança
    setActiveFilter(filter);
  };

  // Variantes de animação para o conteúdo do gráfico
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Variantes para os botões de filtro
  const filterButtonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: { 
        delay: 0.1 * custom,
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }),
    tap: { scale: 0.95 }
  };

  return (
    <AnimatedCard 
      className={`border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${className}`}
      variant="default"
      depth={2}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedIcon
            type={chartIconType}
            containerClassName="bg-blue-100 dark:bg-blue-900/30"
            className="text-blue-600 dark:text-blue-400"
            isPrimary={true}
          />
          <motion.h3 
            className="font-semibold text-slate-800 dark:text-slate-100"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
        </div>
        {showFilter ? (
          <div className="flex gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1 text-sm">
              <motion.div
                custom={1}
                variants={filterButtonVariants}
                initial="initial"
                animate="animate"
                whileTap="tap"
              >
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
                  Diário
                </Button>
              </motion.div>
              <motion.div
                custom={2}
                variants={filterButtonVariants}
                initial="initial"
                animate="animate"
                whileTap="tap"
              >
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
                  Semanal
                </Button>
              </motion.div>
              <motion.div
                custom={3}
                variants={filterButtonVariants}
                initial="initial"
                animate="animate"
                whileTap="tap"
              >
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
                  Mensal
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
      <div className="p-4">
        <motion.div 
          className="relative"
          style={{ height: `${height}px` }}
          variants={chartVariants}
          initial="hidden"
          animate={isChartVisible ? "visible" : "hidden"}
        >
          {data ? (
            <canvas ref={canvasRef} />
          ) : (
            <motion.div 
              className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Carregando dados...
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatedCard>
  );
};

export default ChartCard;

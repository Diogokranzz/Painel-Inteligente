import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import AnimatedIcon from "./AnimatedIcon";
import AnimatedCard from "./AnimatedCard";

interface StatusCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: "user" | "eye" | "percent" | "timer";
  iconBgColor: string;
  iconColor: string;
}

const StatusCard = ({
  title,
  value,
  change,
  trend,
  icon,
  iconBgColor,
  iconColor,
}: StatusCardProps) => {
  // Variantes para animação dos números
  const numberVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2 
      }
    }
  };
  
  // Variantes para animação do percentual de mudança
  const changeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15, 
        delay: 0.4 
      }
    }
  };
  
  // Variantes para o título
  const titleVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <AnimatedCard 
      className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      variant="elevated"
      depth={3}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <motion.h3 
              className="text-sm font-medium text-slate-500 dark:text-slate-400"
              variants={titleVariants}
              initial="initial"
              animate="animate"
            >
              {title}
            </motion.h3>
            <div className="mt-1 flex items-baseline">
              <motion.p 
                className="text-2xl font-semibold text-slate-800 dark:text-slate-100"
                variants={numberVariants}
                initial="initial"
                animate="animate"
              >
                {value}
              </motion.p>
              <motion.span 
                className={`ml-2 text-sm font-medium flex items-center ${
                  trend === "up" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
                variants={changeVariants}
                initial="initial"
                animate="animate"
              >
                {trend === "up" ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {change}%
              </motion.span>
            </div>
            <motion.p 
              className="text-xs text-slate-400 dark:text-slate-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6 }}
            >
              vs período anterior
            </motion.p>
          </div>
          <AnimatedIcon
            type={icon}
            containerClassName={iconBgColor}
            className={iconColor}
            size={24}
            isPrimary={true}
          />
        </div>
      </div>
    </AnimatedCard>
  );
};

export default StatusCard;

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import AnimatedIcon from "./AnimatedIcon";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  // Variantes de animação para o seletor
  const containerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20
      }
    }
  };

  // Variantes para o efeito de pulso quando o valor muda
  const selectVariants = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 }
    }
  };

  // Converter o valor selecionado para um texto legível
  const getDisplayText = (val: string) => {
    switch(val) {
      case "1h": return "Última hora";
      case "6h": return "Últimas 6 horas";
      case "24h": return "Últimas 24 horas";
      case "7d": return "Últimos 7 dias";
      case "30d": return "Últimos 30 dias";
      default: return "Selecione o período";
    }
  };

  return (
    <motion.div 
      className="relative flex items-center gap-2"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatedIcon
        type="timer"
        containerClassName="bg-slate-100 dark:bg-slate-700"
        className="text-slate-600 dark:text-slate-300"
        size={20}
      />
      
      <motion.div
        key={value} // Alternar a chave para reativar a animação quando o valor muda
        variants={selectVariants}
        initial="initial"
        animate="pulse"
      >
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-[180px] bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <SelectValue placeholder="Selecione o período">
              {getDisplayText(value)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {[
                { value: "1h", label: "Última hora" },
                { value: "6h", label: "Últimas 6 horas" },
                { value: "24h", label: "Últimas 24 horas" },
                { value: "7d", label: "Últimos 7 dias" },
                { value: "30d", label: "Últimos 30 dias" }
              ].map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SelectItem 
                    value={option.value}
                    className={`cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      value === option.value 
                        ? "text-primary font-medium" 
                        : ""
                    }`}
                  >
                    {option.label}
                  </SelectItem>
                </motion.div>
              ))}
            </motion.div>
          </SelectContent>
        </Select>
      </motion.div>
    </motion.div>
  );
};

export default TimeRangeSelector;

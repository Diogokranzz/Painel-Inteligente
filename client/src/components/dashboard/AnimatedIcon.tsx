import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users, 
  Eye, 
  Percent, 
  Timer,
  BarChart4,
  PieChart,
  LineChart,
  LayoutList,
  Laptop,
  Smartphone,
  Tablet,
  Workflow
} from 'lucide-react';

type IconType = 
  | 'user' 
  | 'eye' 
  | 'percent' 
  | 'timer' 
  | 'chart' 
  | 'pie' 
  | 'line'
  | 'table'
  | 'desktop'
  | 'mobile'
  | 'tablet'
  | 'funnel';

interface AnimatedIconProps {
  type: IconType;
  className?: string;
  containerClassName?: string;
  size?: number;
  color?: string;
  isHovered?: boolean;
  isPrimary?: boolean;
}

const iconComponents: Record<IconType, ReactNode> = {
  user: <Users />,
  eye: <Eye />,
  percent: <Percent />,
  timer: <Timer />,
  chart: <BarChart4 />,
  pie: <PieChart />,
  line: <LineChart />,
  table: <LayoutList />,
  desktop: <Laptop />,
  mobile: <Smartphone />,
  tablet: <Tablet />,
  funnel: <Workflow />
};

// Variantes de animação para diferentes estados
const iconVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } },
  tap: { scale: 0.95 },
  primary: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 2,
    }
  }
};

// Animação de pulsação para o fundo do ícone
const bgVariants = {
  initial: { opacity: 0.8 },
  hover: { 
    opacity: 1, 
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  },
  primary: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 3,
    }
  }
};

const AnimatedIcon = ({ 
  type, 
  className, 
  containerClassName,
  size = 24, 
  color = 'currentColor',
  isHovered = false,
  isPrimary = false
}: AnimatedIconProps) => {
  const IconComponent = iconComponents[type];
  
  const activeVariant = isPrimary ? "primary" : (isHovered ? "hover" : "initial");

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-xl p-2.5",
        containerClassName
      )}
      initial="initial"
      animate={activeVariant}
      whileHover="hover"
      whileTap="tap"
      variants={bgVariants}
    >
      <motion.div
        className={cn("text-current", className)}
        style={{ fontSize: size, color }}
        variants={iconVariants}
      >
        {IconComponent}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedIcon;
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  depth?: number; // Profundidade do efeito 3D (1-10)
  variant?: "default" | "elevated" | "outlined";
}

const AnimatedCard = ({
  children,
  className,
  depth = 5, // Valor padrão para profundidade média
  variant = "default"
}: AnimatedCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Limite a profundidade entre 1-10
  const safeDepth = Math.max(1, Math.min(10, depth));
  
  // Calcular a rotação máxima com base na profundidade
  const maxRotation = safeDepth * 1.5;
  
  // Variantes condicionais baseadas no tipo de cartão
  const cardVariants = {
    default: {
      rest: { 
        scale: 1, 
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)"
      },
      hover: { 
        scale: 1.02, 
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3 }
      }
    },
    elevated: {
      rest: { 
        scale: 1, 
        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)"
      },
      hover: { 
        scale: 1.04, 
        boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.12)",
        transition: { duration: 0.4 }
      }
    },
    outlined: {
      rest: { 
        scale: 1, 
        boxShadow: "none",
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
      hover: { 
        scale: 1.01, 
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.05)",
        borderColor: "rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 }
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden", 
        variant === "outlined" ? "border border-solid" : "",
        className
      )}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      variants={cardVariants[variant]}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)} 
      onTouchEnd={() => setIsHovered(false)}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateX: isHovered ? -maxRotation / 3 : 0,
          rotateY: isHovered ? maxRotation / 2 : 0,
          transition: { duration: 0.3 }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCard;
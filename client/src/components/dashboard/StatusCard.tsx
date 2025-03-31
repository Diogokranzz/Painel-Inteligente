import { User, Eye, Percent, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const renderIcon = () => {
    switch (icon) {
      case "user":
        return <User className="h-5 w-5" />;
      case "eye":
        return <Eye className="h-5 w-5" />;
      case "percent":
        return <Percent className="h-5 w-5" />;
      case "timer":
        return <Clock className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                {value}
              </p>
              <span 
                className={`ml-2 text-sm font-medium flex items-center ${
                  trend === "up" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend === "up" ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" 
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" 
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {change}%
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              vs previous period
            </p>
          </div>
          <div className={`p-2 rounded-full ${iconBgColor} ${iconColor}`}>
            {renderIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;

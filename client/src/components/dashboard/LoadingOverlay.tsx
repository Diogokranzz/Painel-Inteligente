import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay = ({ message = "Carregando..." }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50 dark:bg-slate-900/70">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-slate-800 dark:text-slate-200 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

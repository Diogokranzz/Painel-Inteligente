import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Table as TableIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type PageAnalytics } from "@shared/schema";
import AnimatedCard from "./AnimatedCard";
import AnimatedIcon from "./AnimatedIcon";

interface DataTableProps {
  title: string;
  data: PageAnalytics[];
}

const DataTable = ({ title, data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filtrar dados com base no termo de pesquisa
  const filteredData = searchTerm
    ? data.filter((item) =>
        item.pagePath.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  // Paginar dados
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Formatar segundos para minutos e segundos
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Variantes de animação para itens da tabela
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    exit: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  // Variantes para o cabeçalho da tabela
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Variantes para botões de paginação
  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0.8 },
    hover: { scale: 1.05, opacity: 1 },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatedCard 
      className="border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800"
      variant="default"
      depth={1}
    >
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedIcon
            type="table"
            containerClassName="bg-purple-100 dark:bg-purple-900/30"
            className="text-purple-600 dark:text-purple-400"
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
        <motion.div 
          className="relative"
          initial={{ opacity: 0, width: "80%" }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Input
            type="text"
            placeholder="Buscar páginas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:border-slate-700"
          />
          <motion.div 
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Search className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800">
            <TableRow>
              <motion.th 
                className="h-12 px-4 text-left align-middle font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Página
              </motion.th>
              <motion.th 
                className="h-12 px-4 text-left align-middle font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Visualizações
              </motion.th>
              <motion.th 
                className="h-12 px-4 text-left align-middle font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                Únicas
              </motion.th>
              <motion.th 
                className="h-12 px-4 text-left align-middle font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                Taxa de Saída
              </motion.th>
              <motion.th 
                className="h-12 px-4 text-left align-middle font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                Tempo Médio
              </motion.th>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedData.map((row, index) => (
                <motion.tr 
                  key={index} 
                  className="bg-white dark:bg-slate-900 dark:border-slate-700"
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                >
                  <TableCell className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {row.pagePath}
                  </TableCell>
                  <TableCell className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {new Intl.NumberFormat('pt-BR').format(row.views)}
                  </TableCell>
                  <TableCell className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {new Intl.NumberFormat('pt-BR').format(row.uniqueViews)}
                  </TableCell>
                  <TableCell className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.bounceRate}%
                  </TableCell>
                  <TableCell className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {formatTime(row.avgTime)}
                  </TableCell>
                </motion.tr>
              ))}
              {paginatedData.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TableCell colSpan={5} className="text-center py-4 text-slate-500 dark:text-slate-400">
                    Nenhum dado encontrado
                  </TableCell>
                </motion.tr>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(startIndex + rowsPerPage, filteredData.length)}
            </span>{" "}
            de <span className="font-medium">{filteredData.length}</span> resultados
          </motion.div>
          <div className="flex gap-2">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="border-slate-300 dark:border-slate-600"
              >
                Anterior
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="border-slate-300 dark:border-slate-600"
              >
                Próximo
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default DataTable;

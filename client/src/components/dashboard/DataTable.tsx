import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type PageAnalytics } from "@shared/schema";

interface DataTableProps {
  title: string;
  data: PageAnalytics[];
}

const DataTable = ({ title, data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter((item) =>
        item.pagePath.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  // Paginate data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Format seconds to minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </CardTitle>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:border-slate-700"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800">
            <TableRow>
              <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Page
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Views
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Unique
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Bounce Rate
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg. Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} className="bg-white dark:bg-slate-900 dark:border-slate-700">
                <TableCell className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {row.pagePath}
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                  {new Intl.NumberFormat().format(row.views)}
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                  {new Intl.NumberFormat().format(row.uniqueViews)}
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                  {row.bounceRate}%
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                  {formatTime(row.avgTime)}
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-slate-500 dark:text-slate-400">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-slate-600 dark:text-slate-300">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataTable;

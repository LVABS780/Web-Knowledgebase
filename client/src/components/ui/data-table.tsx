"use client";
import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as TanStackTable,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending?: boolean;
  page?: number;
  limit?: number;
  pages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  toolbar?: (table: TanStackTable<TData>) => React.ReactNode;
  defaultColumnVisibility?: VisibilityState;
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
  page?: number;
  limit?: number;
  pages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPending = false,
  toolbar,
  defaultColumnVisibility,
  page,
  limit,
  pages,
  onPageChange,
  onLimitChange,
}: DataTableProps<TData, TValue>) {
  const memoColumns = React.useMemo(() => columns, [columns]);
  const memoData = React.useMemo(() => data, [data]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility ?? {});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,

    globalFilterFn: "includesString",
    filterFns: {
      equals: (row, columnId, filterValue) =>
        row.getValue<string>(columnId) === filterValue,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    manualPagination: !!onPageChange,
    pageCount: typeof pages === "number" ? pages : undefined,
  });

  const [dataLoading, setDataLoading] = React.useState(false);

  React.useEffect(() => {
    setDataLoading(isPending);
  }, [isPending]);

  return (
    <div>
      {toolbar && toolbar(table)}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-blue-50 dark:bg-black opacity-90"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {dataLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                    <span className="ml-2 text-gray-500">Loading result</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        page={page}
        limit={limit}
        pages={pages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DataTablePagination<TData>({
  table,
  page,
  limit,
  pages,
  onPageChange,
  onLimitChange,
}: DataTablePaginationProps<TData>) {
  const currentPage =
    typeof page === "number"
      ? page
      : table.getState().pagination?.pageIndex + 1 || 1;
  const pageSize =
    typeof limit === "number"
      ? limit
      : table.getState().pagination?.pageSize || 10;
  const totalPages =
    typeof pages === "number" ? pages : table.getPageCount() || 1;

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    if (onLimitChange) {
      onLimitChange(newLimit);
      if (onPageChange) onPageChange(1);
    } else {
      table.setPageSize(newLimit);
      table.setPageIndex(0);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      table.setPageIndex(newPage - 1);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-4 py-4">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows</p>
          <Select
            value={`${pageSize}`}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-auto items-center justify-center text-sm font-medium">
          Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

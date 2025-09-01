import { Table } from "@tanstack/react-table";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Download } from "lucide-react";
import Papa from "papaparse";
// import { useAuth } from "@/app/contexts/auth-context";
import { useEffect } from "react";
import { saveAs } from "file-saver";
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unnecessary-type-constraint
  interface ColumnMeta<TData extends unknown, TValue> {
    exportable?: boolean;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ToolbarConfig<TData> = {
  enableGlobalSearch?: boolean;
  specificColumnSearch?: string;
  enableTooltip?: React.ReactNode;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
};

export function DataTableToolbar<TData>(props: {
  table: Table<TData>;
  config: ToolbarConfig<TData>;
  onSelectionChange?: (ids: string[]) => void;
}) {
  // const { user } = useAuth();
  // const role = user?.role;
  const { table, config, onSelectionChange } = props;
  const rowSelectionMap = table.getState().rowSelection;

  useEffect(() => {
    if (!onSelectionChange) return;

    const selectedRowKeys = Object.entries(rowSelectionMap)
      .filter(([, isSelected]) => isSelected)
      .map(([rowKey]) => rowKey);

    const selectedIds = selectedRowKeys.map((rowKey) => {
      const row = table.getRow(rowKey);
      return (row.original as { _id: string })._id;
    });

    onSelectionChange(selectedIds);
  }, [rowSelectionMap, onSelectionChange, table]);

  const exportColumns = table
    .getAllColumns()
    .filter(
      (col) => col.getIsVisible() && col.columnDef.meta?.exportable !== false
    );

  const rows = table.getCoreRowModel().rows.map((row) =>
    exportColumns.reduce((acc, col) => {
      const cell = row.getVisibleCells().find((c) => c.column.id === col.id);
      acc[col.id] = cell ? cell.getValue() : "";
      return acc;
    }, {} as Record<string, unknown>)
  );

  const handleExportCsv = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "export.csv");
  };

  return (
    <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap justify-center sm:justify-between py-4">
      {config.specificColumnSearch && (
        <Input
          placeholder={`Search by ${config.specificColumnSearch}`}
          value={
            (table
              .getColumn(config.specificColumnSearch!)!
              .getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table
              .getColumn(config.specificColumnSearch!)!
              .setFilterValue(e.target.value)
          }
          className="max-w-2xl custom-border"
        />
      )}

      {config.enableGlobalSearch && (
        <Input
          placeholder="Search everything…"
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-2xl custom-border"
        />
      )}
      <div className="flex gap-5 items-center flex-wrap sm:flex-nowrap justify-center">
        {config.enableTooltip && <>{config.enableTooltip}</>}

        {config.enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="custom-border"
            >
              <Button
                variant="outline"
                size="sm"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(visible) => col.toggleVisibility(visible)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {config.enableExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-2 button"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
        )}
      </div>
    </div>
  );
}

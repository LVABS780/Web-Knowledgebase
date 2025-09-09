/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BulkUploadProps<T> {
  onDataImported: (data: T[]) => void;
  onApplyFirstRow?: (data: T) => void;
  onBulkSubmit?: (data: T[]) => void;
  onClear?: () => void;
  fieldMappings: Record<string, string[]>;
  requiredFields: string[];
  tableColumns: Array<{
    key: keyof T;
    label: string;
    renderCell?: (value: any) => React.ReactNode;
  }>;
  maxPreviewRows?: number;
  acceptedFileTypes?: string;
  isLoading?: boolean;
  showApplyFirstRow?: boolean;
  showBulkSubmit?: boolean;
  description?: string;
  className?: string;
}

function BulkUpload<T extends Record<string, any>>({
  onDataImported,
  onApplyFirstRow,
  onBulkSubmit,
  onClear,
  fieldMappings,
  requiredFields,
  tableColumns,
  maxPreviewRows = 50,
  acceptedFileTypes = ".csv",
  isLoading = false,
  showApplyFirstRow = true,
  showBulkSubmit = true,
  description,
  className = "",
}: BulkUploadProps<T>) {
  const [showImportSection, setShowImportSection] = useState(false);
  const [importedRows, setImportedRows] = useState<T[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];
          if (data.length === 0) {
            toast.error("CSV file is empty");
            return;
          }

          const mappedRows: T[] = data
            .map((row) => {
              const mapped = {} as T;

              Object.keys(fieldMappings).forEach((fieldKey) => {
                const possibleColumns = fieldMappings[fieldKey];
                const value = possibleColumns.find(
                  (col) => row[col] !== undefined
                );
                mapped[fieldKey as keyof T] = (
                  value ? row[value] : ""
                ) as T[keyof T];
              });

              return mapped;
            })
            .filter((row) => {
              return requiredFields.every(
                (field) => row[field] && String(row[field]).trim()
              );
            });

          if (mappedRows.length === 0) {
            const requiredFieldsText = requiredFields.join(", ");
            toast.error(
              `No valid rows found. Ensure ${requiredFieldsText} are present.`
            );
            return;
          }

          setImportedRows(mappedRows);
          onDataImported(mappedRows);
          toast.success(
            `Imported ${mappedRows.length} row(s). Review and submit.`
          );
        } catch (error) {
          console.error("CSV parsing error:", error);
          toast.error("Error parsing CSV file");
        }
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        toast.error("Error reading CSV file");
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyFirstRow = () => {
    if (importedRows.length === 0 || !onApplyFirstRow) return;
    onApplyFirstRow(importedRows[0]);
    toast.success("First imported row applied to form");
    setShowImportSection(false);
  };

  const handleClearData = () => {
    setImportedRows([]);
    setShowImportSection(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClear?.();
  };

  const handleBulkSubmit = () => {
    if (importedRows.length === 0 || !onBulkSubmit) {
      toast.error("No imported rows to submit");
      return;
    }
    onBulkSubmit(importedRows);
  };

  return (
    <div
      className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span className="font-medium text-sm">Import from CSV</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImportSection(!showImportSection)}
          className="p-1"
        >
          {showImportSection ? (
            <X className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showImportSection && (
        <div className="space-y-3">
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileImport}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#6A00B4] file:text-white hover:file:bg-[#7f04d4]"
          />

          {importedRows.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-sm text-green-800 dark:text-green-200 mb-2">
                Imported Rows Preview ({importedRows.length}):
              </h4>
              <div className="max-h-64 overflow-auto rounded border bg-white dark:bg-transparent">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      {tableColumns.map((col) => (
                        <TableHead key={String(col.key)}>{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedRows.slice(0, maxPreviewRows).map((row, idx) => (
                      <TableRow key={idx}>
                        {tableColumns.map((col) => (
                          <TableCell key={String(col.key)}>
                            {col.renderCell
                              ? col.renderCell(row[col.key])
                              : String(row[col.key] || "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                  {importedRows.length > maxPreviewRows && (
                    <TableCaption>
                      Showing first {maxPreviewRows} rows
                    </TableCaption>
                  )}
                </Table>
              </div>
              <div className="flex gap-2 mt-3">
                {showApplyFirstRow && onApplyFirstRow && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyFirstRow}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Apply First Row To Form
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleClearData}
                >
                  Clear
                </Button>
                {showBulkSubmit && onBulkSubmit && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#6A00B4] text-white hover:bg-[#7f04d4]"
                    onClick={handleBulkSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Importing..." : "Bulk Create"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BulkUpload;

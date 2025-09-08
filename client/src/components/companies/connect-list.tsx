"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../../app/contexts/auth-context";
import { useLetsConnectQuery } from "@/hooks/useConnect";
import { type LetsConnect } from "../../services/connectServices";

export default function LetsConnectList() {
  const { user } = useAuth();
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";

  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: letsConnects = [], isLoading } = useLetsConnectQuery();

  const filteredData = useMemo(() => {
    if (selectedType === "all") return letsConnects;
    return letsConnects.filter((l) =>
      l.services.includes(selectedType as string)
    );
  }, [letsConnects, selectedType]);

  const columns: ColumnDef<LetsConnect>[] = [
    {
      id: "id",
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const formattedId = `C${String(row.index + 1).padStart(3, "0")}`;
        return <span>{formattedId}</span>;
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          className="ml-6"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          className="ml-6"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      id: "services",
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.services.map((s) => (
            <span
              key={s}
              className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    },
  ];

  if (!isCompanyAdmin) return null;

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Let&apos;s Connect Submissions
          </h2>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="w-auto custom-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
              <SelectItem value="Consulting">Consulting</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Data Analytics">Data Analytics</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-6 flex justify-center items-center min-h-64">
              <div className="text-lg">Loading submissions...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  config={{ enableGlobalSearch: true, enableExport: true }}
                />
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

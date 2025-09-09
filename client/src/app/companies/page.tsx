"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, Trash2 } from "lucide-react";
import {
  useCompaniesQuery,
  useDeleteCompanyMutation,
} from "@/hooks/useCompanies";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "../../components/ui/data-table";
import { DataTableToolbar } from "../../components/ui/data-table-toolbar";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CompanyRegistrationSheet from "../../components/companies/company-registration";
import { CompanyItem } from "@/services/companyService";
import { toast } from "sonner";
import Link from "next/link";

const CompanyPage = () => {
  const { data: companies = [], isLoading } = useCompaniesQuery();
  const { mutate: deleteCompany, isPending: isDeleting } =
    useDeleteCompanyMutation();
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<string>("active");

  const filteredCompanies =
    selectedCompanyType === "active"
      ? companies.filter((company) => company.company.isActive)
      : companies.filter((company) => !company.company.isActive);

  const columns: ColumnDef<CompanyItem>[] = [
    {
      id: "id",
      accessorFn: (row) => row.company._id,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formattedId = `C${String(row.index + 1).padStart(3, "0")}`;
        return (
          <span
            className={`${!row.original.company.isActive && "text-red-500"}`}
          >
            {formattedId}
          </span>
        );
      },
    },
    {
      id: "name",
      accessorFn: (row) => row.companyAdmin?.name || row.company.name,
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
      cell: ({ row }) => {
        const name =
          row.original.companyAdmin?.name || row.original.company.name;
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="border border-black/30 size-7">
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span
              className={`${!row.original.company.isActive && "text-red-500"}`}
            >
              {name}
            </span>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorFn: (row) => row.companyAdmin?.email || "",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className={`${!row.original.company.isActive && "text-red-500"}`}>
          {row.original.companyAdmin?.email || ""}
        </span>
      ),
    },
    {
      id: "phone",
      accessorFn: (row) => row.companyAdmin?.phone || "",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className={`${!row.original.company.isActive && "text-red-500"}`}>
          {row.original.companyAdmin?.phone || ""}
        </span>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className={`${!row.original.company.isActive && "text-red-500"}`}>
          {row.original.company.address || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.company.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.company.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-4">
            <CompanyRegistrationSheet companyId={row.original.company._id} />
            <Trash2
              className={`cursor-pointer hover:text-red-800 ${
                isDeleting ? "text-gray-400" : "text-red-600"
              }`}
              onClick={() => {
                if (
                  !isDeleting &&
                  window.confirm(
                    "Are you sure you want to delete this company?"
                  )
                ) {
                  deleteCompany(row.original.company._id, {
                    onSuccess: () => {
                      toast.success("Company deleted successfully!");
                    },
                    onError: (error) => {
                      toast.error(
                        "Failed to delete company. Please try again."
                      );
                      console.error("Delete company error:", error);
                    },
                  });
                }
              }}
            />
          </div>
        );
      },
      meta: { exportable: false },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end items-center">
        <CompanyRegistrationSheet />
        <Link
          href="/companies/bulk-upload"
          passHref
        >
          <Button
            className="bg-[#6A00B4] text-white hover:bg-[#7f04d4] hover:text-white"
            variant="outline"
          >
            Bulk Upload
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Companies</h2>
          <Select
            value={selectedCompanyType}
            onValueChange={(value) => setSelectedCompanyType(value)}
          >
            <SelectTrigger className="w-auto custom-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">All Companies</SelectItem>
              <SelectItem value="inactive">Inactive Companies</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-6 space-y-6">
              <div className="flex justify-center items-center min-h-64">
                <div className="text-lg">Loading companies...</div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredCompanies}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  config={{
                    enableGlobalSearch: true,
                    enableExport: true,
                  }}
                />
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyPage;

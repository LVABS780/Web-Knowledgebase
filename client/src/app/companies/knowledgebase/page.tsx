"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUpDown, Trash2 } from "lucide-react";
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
import CreateResource from "@/components/resources/create-resource";
import { useAuth } from "../../contexts/auth-context";
import {
  useDeleteResourceMutation,
  useResourcesQuery,
} from "@/hooks/useResources";
import { type ResourceItem } from "@/services/resourceService";
import { toast } from "sonner";
import LetsConnectList from "@/components/companies/connect-list";

export default function ResourcesPage() {
  const { user } = useAuth();
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";

  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("active");

  const { data: resources = [], isLoading } = useResourcesQuery();
  const { mutate: deleteResource, isPending: isDeleting } =
    useDeleteResourceMutation();

  const userScopedResources = useMemo(() => {
    if (!user?._id) return [] as ResourceItem[];
    return resources.filter((r) => r.createdBy?._id === user._id);
  }, [resources, user?._id]);

  const filteredResources = useMemo(() => {
    const list = userScopedResources;
    if (selectedResourceType === "active")
      return list.filter((r) => r.isActive);
    return list.filter((r) => !r.isActive);
  }, [userScopedResources, selectedResourceType]);

  const columns: ColumnDef<ResourceItem>[] = [
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
        const formattedId = `R${String(row.index + 1).padStart(3, "0")}`;
        return (
          <span className={`${!row.original.isActive && "text-red-500"}`}>
            {formattedId}
          </span>
        );
      },
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          className="ml-6"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className={`${!row.original.isActive && "text-red-500"}`}>
          {row.original.title}
        </span>
      ),
    },

    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          className="ml-6"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className={`${!row.original.isActive && "text-red-500"}`}>
          {row.original.categoryName}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.isActive ? "Publish" : "Draft"}
        </span>
      ),
    },
    {
      id: "action",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          <CreateResource resourceId={row.original._id} />
          <Trash2
            className={`cursor-pointer hover:text-red-800 ${
              isDeleting ? "text-gray-400" : "text-red-600"
            }`}
            onClick={() => {
              if (
                !isDeleting &&
                window.confirm("Are you sure you want to delete this resource?")
              ) {
                deleteResource(row.original._id, {
                  onSuccess: () => {
                    toast.success("Resource deleted successfully!");
                  },
                  onError: (error) => {
                    toast.error("Failed to delete resource. Please try again.");
                    console.error("Delete resource error:", error);
                  },
                });
              }
            }}
          />
        </div>
      ),
      meta: { exportable: false },
    },
  ];

  if (!isCompanyAdmin) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end items-center">
        <CreateResource />
      </div>
      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">My Resources</h2>
          <Select
            value={selectedResourceType}
            onValueChange={(value) => setSelectedResourceType(value)}
          >
            <SelectTrigger className="w-auto custom-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">All Resources</SelectItem>
              <SelectItem value="inactive">Inactive Resources</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-6 space-y-6">
              <div className="flex justify-center items-center min-h-64">
                <div className="text-lg">Loading resources...</div>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredResources}
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
      <LetsConnectList />
    </div>
  );
}

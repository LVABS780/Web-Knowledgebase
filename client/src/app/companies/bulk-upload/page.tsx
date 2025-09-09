"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BulkUpload from "@/components/companies/bulkUpload";
import { useBulkCreateCompaniesMutation } from "@/hooks/useCompanies";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function CompaniesBulkUploadPage() {
  const router = useRouter();
  const { mutate: bulkCreate, isPending: isBulkCreating } =
    useBulkCreateCompaniesMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBulkSubmit = (data: any[]) => {
    bulkCreate(data, {
      onSuccess: (res) => {
        const createdCount = res?.data?.created?.length ?? 0;
        const failedCount = res?.data?.failed?.length ?? 0;
        if (createdCount > 0) {
          toast.success(
            `Created ${createdCount} companie(s).${
              failedCount ? ` ${failedCount} failed.` : ""
            }`
          );
        } else {
          toast.error("All rows failed to create");
        }
        router.push("/companies");
      },
      onError: (err) => {
        console.error("Bulk create error:", err);
        toast.error("Bulk create failed. Please try again.");
      },
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Bulk Upload Companies</h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload a CSV with columns: name, email, phone, address, password.
            Required: name, email, password.
          </p>

          <BulkUpload
            onDataImported={() => {}}
            onApplyFirstRow={() => {}}
            onBulkSubmit={handleBulkSubmit}
            fieldMappings={{
              name: ["name", "Name", "company_name", "Company Name"],
              email: ["email", "Email", "company_email", "Company Email"],
              phone: ["phone", "Phone", "company_phone", "Company Phone"],
              address: [
                "address",
                "Address",
                "company_address",
                "Company Address",
              ],
              password: ["password", "Password"],
            }}
            requiredFields={["name", "email", "password"]}
            tableColumns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
              {
                key: "password",
                label: "Password",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderCell: (v: any) => (v ? "••••••" : ""),
              },
            ]}
            isLoading={isBulkCreating}
            description="Upload CSV with: name, email, phone, address, password"
            showApplyFirstRow={false}
          />

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/companies")}
            >
              Back to Companies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CompaniesBulkUploadPage;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BulkUpload from "@/components/companies/bulkUpload";
import { useBulkCreateCompaniesMutation } from "@/hooks/useCompanies";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ADDRESS_OPTIONS = [
  { id: "1", label: "New York, NY 10001", value: "new_york_ny_10001" },
  { id: "2", label: "Los Angeles, CA 90210", value: "los_angeles_ca_90210" },
  { id: "3", label: "Chicago, IL 60601", value: "chicago_il_60601" },
  { id: "4", label: "Houston, TX 77001", value: "houston_tx_77001" },
  { id: "5", label: "Phoenix, AZ 85001", value: "phoenix_az_85001" },
  { id: "6", label: "Philadelphia, PA 19101", value: "philadelphia_pa_19101" },
  { id: "7", label: "San Antonio, TX 78201", value: "san_antonio_tx_78201" },
  { id: "8", label: "San Diego, CA 92101", value: "san_diego_ca_92101" },
  { id: "9", label: "Dallas, TX 75201", value: "dallas_tx_75201" },
  { id: "10", label: "San Jose, CA 95101", value: "san_jose_ca_95101" },
  { id: "11", label: "Austin, TX 78701", value: "austin_tx_78701" },
  { id: "12", label: "Jacksonville, FL 32099", value: "jacksonville_fl_32099" },
  { id: "13", label: "Fort Worth, TX 76101", value: "fort_worth_tx_76101" },
  { id: "14", label: "Columbus, OH 43085", value: "columbus_oh_43085" },
  { id: "15", label: "Charlotte, NC 28201", value: "charlotte_nc_28201" },
  {
    id: "16",
    label: "San Francisco, CA 94102",
    value: "san_francisco_ca_94102",
  },
  { id: "17", label: "Indianapolis, IN 46201", value: "indianapolis_in_46201" },
  { id: "18", label: "Seattle, WA 98101", value: "seattle_wa_98101" },
  { id: "19", label: "Denver, CO 80201", value: "denver_co_80201" },
  { id: "20", label: "Washington, DC 20001", value: "washington_dc_20001" },
];

function CompaniesBulkUploadPage() {
  const router = useRouter();
  const { mutate: bulkCreate, isPending: isBulkCreating } =
    useBulkCreateCompaniesMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBulkSubmit = (data: any[]) => {
    const transformedData = data.map((item) => ({
      ...item,
      addressId: item.address,
    }));

    bulkCreate(transformedData, {
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
            Required: name, email, password. Address should match one of the
            predefined locations.
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
                "location",
                "Location",
              ],
              password: ["password", "Password"],
            }}
            requiredFields={["name", "email", "password"]}
            tableColumns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              {
                key: "address",
                label: "Address",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderCell: (value: any) => {
                  if (!value) return "Not selected";
                  const addressOption = ADDRESS_OPTIONS.find(
                    (addr) => addr.id === value
                  );
                  return addressOption ? addressOption.label : value;
                },
              },
              {
                key: "password",
                label: "Password",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderCell: (v: any) => (v ? "••••••" : ""),
              },
            ]}
            isLoading={isBulkCreating}
            description="Upload CSV with: name, email, phone, address, password. Address values will be matched to predefined locations."
            showApplyFirstRow={false}
            addressOptions={ADDRESS_OPTIONS}
            dynamicFields={["address"]}
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

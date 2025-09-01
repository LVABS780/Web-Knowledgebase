"use client";

import CreateResource from "@/components/resources/create-resource";
import { useAuth } from "./contexts/auth-context";

export default function KnowledgeBasePage() {
  const { user } = useAuth();
  return <div className="space-y-2 p-6">{user && <CreateResource />}</div>;
}

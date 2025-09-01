"use client";
import { redirect } from "next/navigation";
import { useAuth } from "./contexts/auth-context";

export default function RootRedirect() {
  const { token } = useAuth();
  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/knowledgebase");
  }
}

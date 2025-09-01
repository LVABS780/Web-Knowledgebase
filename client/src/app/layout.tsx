import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/auth-context";

import ReactQueryProvider from "@/utils/react-query-provider";
import { Toaster } from "sonner";
import ClientLayout from "@/components/client-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnowledgeHub",
  description: "Knowledge management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>

            <Toaster
              position="top-right"
              richColors
              expand={true}
            />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

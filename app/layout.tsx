import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import SessionProviderWrapper from "@/lib/providers/AuthProivder";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Employees Review",
  description: "Employees Review",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

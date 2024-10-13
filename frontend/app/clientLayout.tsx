"use client"; // Mark this as a Client Component

import { AuthProvider } from "./context/AuthContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* Client-side context */}
      {children}
    </AuthProvider>
  );
}

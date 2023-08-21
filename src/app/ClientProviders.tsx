import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}

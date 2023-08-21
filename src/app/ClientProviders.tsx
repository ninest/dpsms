"use client"

import { ToastCreator } from "@/app/toast-creator";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      <ToastCreator />
      {children}
    </>
  );
}

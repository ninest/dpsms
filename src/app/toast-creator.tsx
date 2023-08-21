"use client";

import { ToastType, toastMessages } from "@/app/toast-utils";
import { useToast } from "@/components/ui/use-toast";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ToastCreator() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toastId = searchParams.get("toast") as null | ToastType;

  useEffect(() => {
    if (toastId) {
      const message = toastMessages[toastId];
      if (message) {
        toast(toastMessages[toastId]);
      }
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("toast");
      router.replace(`${pathname}?${newSearchParams}`);
    }
  }, [toastId]);

  return null;
}

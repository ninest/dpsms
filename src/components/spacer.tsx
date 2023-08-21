import { cn } from "@/utils";
import { ComponentProps } from "react";

export function Spacer({ className }: ComponentProps<"div">) {
  return <div role="presentation" aria-label="spacer" className={cn("", className)} />;
}

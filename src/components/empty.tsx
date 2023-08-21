import { cn } from "@/utils";
import { HTMLAttributes } from "react";

interface EmptyProps extends HTMLAttributes<HTMLDivElement> {}

export const Empty = ({ children, className }: EmptyProps) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed dark:border-gray-800 p-base rounded-lg text-gray-400 p-5 h-40 flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};

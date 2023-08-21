import { Spacer } from "@/components/spacer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/utils";
import { request } from "http";
import { LucideRuler, LucideClock } from "lucide-react";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  id: string;
  address: string;
  startTime: Date;
  endTime: Date;
  sqft: number;
  itemsDescription: string;
}

export function Tenancy({ id, address, startTime, endTime, sqft, itemsDescription, className }: Props) {
  return (
    <div className={cn("border rounded-md p-5", className)}>
      <div>
        <b>{address}</b>
      </div>
      <Spacer className="h-2" />
      <div className="text-sm">
        <div className="flex items-center space-x-2">
          <LucideRuler className="w-4" /> <div>{sqft} sqft</div>
        </div>
        <div className="flex items-center space-x-2">
          <LucideClock className="w-4" />
          <div>
            {formatDate(startTime)} to {formatDate(endTime)}
          </div>
        </div>
      </div>
      <Spacer className="h-2" />
    </div>
  );
}

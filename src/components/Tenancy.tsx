import { Spacer } from "@/components/spacer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils";
import { request } from "http";
import { LucideRuler, LucideClock } from "lucide-react";

interface Props {
  id: string;
  address: string;
  startTime: Date;
  endTime: Date;
  sqft: number;
  itemsDescription: string;
}

export function Tenancy({ id, address, startTime, endTime, sqft, itemsDescription }: Props) {
  return (
    <div className="border rounded-md p-5">
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

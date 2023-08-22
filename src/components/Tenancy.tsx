import { Spacer } from "@/components/spacer";
import { cn, formatDate, pluralize } from "@/utils";
import { LucideBox, LucideClock, LucideRuler } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  id: string;
  hostListingId: string;
  tenantUserId: string;
  address: string;
  startTime: Date;
  endTime: Date;
  sqft: number;
  itemsDescription: string;
  movers: string[];
}

export function Tenancy({
  id,
  hostListingId,
  tenantUserId,
  address,
  startTime,
  endTime,
  sqft,
  itemsDescription,
  movers,
  className,
}: Props) {
  return (
    <div className={cn("block border rounded-md p-5", className)}>
      <div>
        <Link href={`/profile/${tenantUserId}`}>
          <b>{itemsDescription}</b>
        </Link>{" "}
        at <Link href={`/hosts/${hostListingId}`}>{address}</Link>
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
        <div className="flex items-center space-x-2">
          <LucideBox className="w-4" />
          <div>
            {movers.length} {pluralize(movers.length, "mover", "movers")}
          </div>
        </div>
      </div>
      <Spacer className="h-2" />
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideRuler, LucideClock, LucideListChecks, LucideHeartHandshake } from "lucide-react";
import { usersService } from "@/services/users-service";

interface Props {
  id: string;
  address: string;
  hostClerkId: string;
  hostTrustedBy: number;
  sqft: number;
  timings: string;
  qualifiers: string[];
}

export async function ListingCard({ id, address, hostClerkId, hostTrustedBy, sqft, timings, qualifiers }: Props) {
  const host = await usersService.getUserByClerkId(hostClerkId);
  return (
    <Link href={`/hosts/${id}`}>
      <Card className="w-[300px] h-[200px]">
        <CardHeader>
          <CardTitle>{address}</CardTitle>
          <CardDescription className="flex flex-row items-center">
            {host.firstName} · <LucideHeartHandshake className="w-4 mx-1" /> {hostTrustedBy}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row mb-1 items-center">
            <LucideRuler className="w-4 mr-2" />
            {sqft} sqft
          </div>
          <div className="flex flex-row mb-1 items-center">
            <LucideClock className="w-4 mr-2" />
            {timings}
          </div>
          <div className="flex flex-row mb-1 items-center">
            <LucideListChecks className="w-4 mr-2" />
            {qualifiers.length} qualifier{qualifiers.length === 1 ? "" : "s"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
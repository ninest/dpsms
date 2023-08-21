import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideRuler, LucideClock, LucideListChecks, LucideHeartHandshake, LucideUser2 } from "lucide-react";
import { usersService } from "@/services/users-service";
import { Spacer } from "@/components/spacer";
import { pluralize } from "@/utils";

interface Props {
  id: string;
  address: string;
  hostClerkId: string;
  hostTrustedBy: number;
  sqft: number;
  timings: string;
  qualifiers: string[];
  numTenancyRequests: number;
  numTenancies: number;
}

export async function ListingCard({
  id,
  address,
  hostClerkId,
  hostTrustedBy,
  sqft,
  timings,
  qualifiers,
  numTenancyRequests,
  numTenancies,
}: Props) {
  const host = await usersService.getUserByClerkId(hostClerkId);
  const hasQualifiers = qualifiers.length !== 0;
  const moreThanOneQualifier = qualifiers.length >= 1;

  return (
    <Link href={`/hosts/${id}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">{address}</CardTitle>
          <CardDescription className="flex flex-row items-center">
            {host.firstName ?? <i>No name</i>} · <LucideHeartHandshake className="w-4 mx-1" /> {hostTrustedBy}
          </CardDescription>
        </CardHeader>
        <Spacer className="h-3" />
        <CardContent className="text-sm">
          <div className="flex flex-row mb-1 items-center">
            <LucideRuler className="w-4 mr-2" />
            {sqft} sqft
          </div>
          <div className="flex flex-row mb-1 items-center truncate">
            <LucideClock className="w-4 mr-2" />
            {timings}
          </div>
          <div className="flex flex-row mb-1 items-center">
            <LucideListChecks className="w-4 mr-2" />
            {hasQualifiers ? (
              <>
                {moreThanOneQualifier ? (
                  <>
                    {qualifiers[0]} and {qualifiers.length - 1} more
                  </>
                ) : (
                  <>{qualifiers[0]}</>
                )}
                {/* {qualifiers.length} qualifier{qualifiers.length === 1 ? "" : "s"} */}
              </>
            ) : (
              "No qualifiers"
            )}
          </div>
          <Spacer className="h-2" />
          <div className="flex items-center">
            <LucideUser2 className="w-4 mr-2" />
            {numTenancyRequests === 0 ? "No" : numTenancyRequests}{" "}
            {pluralize(numTenancyRequests, "request", "requests")}, {numTenancies === 0 ? "no" : numTenancies}{" "}
            {pluralize(numTenancies, "tenancy", "tenancies")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

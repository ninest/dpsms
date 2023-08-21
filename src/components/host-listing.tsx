import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Props {
  id: string;
  address: string;
  timings: string;
  qualifiers: string[];
  numTenantsRequested: number;
}

export function HostListing({ id, address, timings, qualifiers, numTenantsRequested }: Props) {
  return (
    <Link href={`/hosts/${id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{address}</CardTitle>
        </CardHeader>

        <CardDescription></CardDescription>

        <CardContent>
          <div>{timings}</div>
          <div>
            <ul className="list-disc ml-6">
              {qualifiers.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">{numTenantsRequested} tenants have requested</div>
        </CardContent>
      </Card>
    </Link>
  );
}

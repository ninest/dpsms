import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>{address}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {startTime.toISOString()} to {endTime.toISOString()}
        </div>
        <div>
          {itemsDescription} - {sqft}sqft
        </div>
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideHeartHandshake } from "lucide-react";
import { Spacer } from "@/components/spacer";
import { Input } from "./ui/input";
import { ReactNode } from "react";

interface Props {
  id: string;
  firstName: string;
  lastName: string;
  trustPercent: number;
  children?: ReactNode;
}

export async function ProfileCard({ id, firstName, lastName, trustPercent, children }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <Link href={`/profile/${id}`}>
          <CardTitle className="text-base">
            {firstName} {lastName}
          </CardTitle>
        </Link>
      </CardHeader>
      <Spacer className="h-3" />
      <CardContent className="text-sm">
        {children ? (
          children
        ) : (
          <div className="flex flex-row items-center">
            <LucideHeartHandshake className="w-4 mx-1" /> {trustPercent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

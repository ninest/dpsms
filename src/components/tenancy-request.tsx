import { Spacer } from "@/components/spacer";
import { TenancyRequest } from "@/types";
import { formatDate } from "@/utils";
import { LucideCheckCircle2, LucideCircleDashed, LucideClock, LucideRuler } from "lucide-react";

interface Props {
  request: TenancyRequest;
}

export function TenancyRequest({ request }: Props) {
  const pending = <LucideCircleDashed className="w-4 text-gray-500" />;
  const accepted = <LucideCheckCircle2 className="text-green-600 w-4" />;

  return (
    <div className="border rounded-md p-5">
      <div>
        <b>{request.description}</b> at {request.address}
      </div>

      <Spacer className="h-2" />
      <div className="text-sm">
        <div className="flex items-center space-x-2">
          <LucideRuler className="w-4" /> <div>{request.sqft} sqft</div>
        </div>
        <div className="flex items-center space-x-2">
          <LucideClock className="w-4" />
          <div>
            {formatDate(request.startTime)} to {formatDate(request.endTime)}
          </div>
        </div>
      </div>
      <Spacer className="h-2" />

      <div>
        <div className="flex items-center space-x-2">
          {request.hostAccepted ? (
            <>
              {accepted}
              <div>Host accepted</div>
            </>
          ) : (
            <>
              {pending}
              <div className="text-gray-600">Host pending</div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {request.tenantAccepted ? (
            <>
              {accepted}
              <div>Tenant accepted</div>
            </>
          ) : (
            <>
              {pending}
              <div className="text-gray-600">Tenant pending</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

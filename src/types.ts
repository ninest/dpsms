export interface HostListing {
  id: string;
  address: string;
  timings: string;
  qualifiers: string[];
  numTenantsRequested: number;
}
export interface TenancyRequest {
  id: string;
  address: string;
  description: string;
  sqft: number;
  startTime: Date;
  endTime: Date;
  hostAccepted: boolean;
  tenantAccepted: boolean;
}

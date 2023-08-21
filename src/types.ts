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

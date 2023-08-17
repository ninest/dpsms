import { prisma } from "@/prisma";

export const tenancyService = {
  async createTenancy(tenancyRequestListingId: string) {
    // Get tenancyRequest
    const trl = await prisma.tenantRequestListing.findUniqueOrThrow({
      where: {
        id: tenancyRequestListingId,
      },
    });

    const tenancy = await prisma.$transaction(async (tx) => {
      // Delete tenancyRequest
      const deletedTenantRequest = await prisma.tenantRequest.delete({
        where: {
          id: trl.tenantRequestId,
        },
      });

      // Copy data to new tenancy

      // TODO: might move duration
      const endTime = new Date(trl.startTime);
      endTime.setDate(endTime.getDate() + deletedTenantRequest.duration);

      const tenancy = await prisma.tenancy.create({
        data: {
          hostListingId: trl.hostListingId,
          tenantUserId: deletedTenantRequest.tenantUserId,
          itemsDescription: deletedTenantRequest.itemsDescription,
          sqft: deletedTenantRequest.sqft,
          startTime: trl.startTime,
          endTime,
        },
      });
      return tenancy;
    });
    return tenancy;
  },
};

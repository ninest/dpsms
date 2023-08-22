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
      const tenancy = await prisma.tenancy.create({
        data: {
          hostListingId: trl.hostListingId,
          tenantUserId: deletedTenantRequest.tenantUserId,
          itemsDescription: deletedTenantRequest.itemsDescription,
          sqft: deletedTenantRequest.sqft,
          startTime: trl.startTime,
          endTime: trl.endTime,
        },
      });
      return tenancy;
    });
    return tenancy;
  },
  async getTenancies() {
    const tenancies = await prisma.tenancy.findMany({
      include: {
        hostListing: true,
        moverUsers: {
          include: {
            user: true,
          },
        },
        tenant: {
          include: {
            user: true,
          },
        },
      },
    });
    return tenancies;
  },
};

import { prisma } from "@/prisma";
import { usersService } from "@/services/users-service";

export const tenantsService = {
  async requestTenancy(
    clerkUserId: string,
    hostListingId: string,
    params: {
      itemsDescription: string;
      sqft: number;
      startTime: Date;
      endTime: Date;
      tenancyRequestId?: string | undefined;
    }
  ) {
    if (params.startTime > params.endTime) {
      throw new Error("Start time must be before end time");
    }
    const tenantUser = await usersService.getUserByClerkId(clerkUserId);
    if (params.tenancyRequestId) {
      await prisma.tenantRequestListing.create({
        data: {
          hostListingId,
          startTime: params.startTime,
          endTime: params.endTime,
          tenantRequestId: params.tenancyRequestId,
        },
      });
    } else {
      // Create TenantRequest
      // Add hostListing to new TenantRequestListing
      await prisma.tenantRequest.create({
        data: {
          itemsDescription: params.itemsDescription,
          sqft: params.sqft,
          tenant: {
            connectOrCreate: {
              where: {
                userId: tenantUser.id,
              },
              create: {
                userId: tenantUser.id,
              },
            },
          },
          tenantRequestListing: {
            create: {
              startTime: params.startTime,
              endTime: params.endTime,
              hostListingId,
            },
          },
        },
      });
    }
  },
  async getTenancyRequestsByHostListing(clerkUserId: string, hostListingId: string) {
    const tenantRequests = await prisma.tenantRequest.findMany({
      where: {
        tenant: {
          user: {
            clerkId: clerkUserId,
          },
        },
        tenantRequestListing: {
          some: {
            hostListingId,
          },
        },
      },
      include: {
        tenantRequestListing: {
          where: {
            hostListingId,
          },
        },
      },
    });
    return tenantRequests;
  },
  async getTenancyRequestsSuggestionsForHostListing(clerkUserId: string, hostListingId: string) {
    const tenantRequests = await prisma.tenantRequest.findMany({
      where: {
        tenant: {
          user: {
            clerkId: clerkUserId,
          },
        },
        tenantRequestListing: {
          none: {
            hostListingId,
          },
        },
      },
    });
    return tenantRequests;
  },
  async acceptTenancy(tenancyRequestListingId: string) {
    await prisma.tenantRequestListing.update({
      where: {
        id: tenancyRequestListingId,
      },
      data: {
        tenantAccepted: true,
      },
    });
  },
};

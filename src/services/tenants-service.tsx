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
      duration: number;
      tenancyRequestId?: string | undefined;
    }
  ) {
    const tenantUser = await usersService.getUserByClerkId(clerkUserId);
    if (params.tenancyRequestId) {
      await prisma.tenantRequestListing.create({
        data: {
          hostListingId,
          startTime: params.startTime,
          tenantRequestId: params.tenancyRequestId,
        },
      });
    } else {
      // Create TenantRequest
      // Add hostListing to new TenantRequestListing
      await prisma.tenantRequest.create({
        data: {
          itemsDescription: params.itemsDescription,
          duration: params.duration,
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
};

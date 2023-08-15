import { prisma } from "@/prisma";
import { usersService } from "@/services/users-service";

export const tenantsService = {
  async requestTenancy(
    clerkUserId: string,
    hostListingId: string,
    params: {
      itemsDescription: string;
      sqft: number;
      duration: number;
    }
  ) {
    const tenantUser = await usersService.getUserByClerkId(clerkUserId);
    // Create TenantRequest
    // Add hostListing to new TenantRequestListing
    const tenantRequest = await prisma.tenantRequest.create({
      data: {
        itemsDescription: params.itemsDescription,
        duration: params.duration,
        sqft: params.sqft,
        tenant: {
          connect: {
            userId: tenantUser.id,
          },
        },
        tenantRequestListing: {
          create: {
            
          }
        }
      },
    });
  },
};

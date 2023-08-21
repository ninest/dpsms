import { prisma } from "@/prisma";
import { usersService } from "@/services/users-service";

type GetHostListingsOptions = {
  qualifiers?: string[];
  includeUserTrustedBy?: boolean;
};

export const hostsService = {
  async createListing(
    clerkId: string,
    params: {
      timings: string;
      sqft: number;
      qualifiers: string[];
      sizeDescription?: string | undefined;
      image?: string | undefined;
      address: string;
      latitude: number;
      longitude: number;
    }
  ) {
    const dbUser = await usersService.getUserByClerkId(clerkId);
    if (!dbUser.hostUser?.isActive) {
      throw new Error("You are not an active host");
    }

    const hostListing = prisma.hostListing.create({
      data: {
        hostUserId: dbUser.hostUser.id,
        ...params,
      },
    });
    return hostListing;
  },
  async getHostListing(id: string) {
    const hostListing = await prisma.hostListing.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        host: {
          include: {
            user: true,
          },
        },
      },
    });
    return hostListing;
  },

  async getHostListings(options?: GetHostListingsOptions) {
    const { qualifiers, includeUserTrustedBy } = options || {};

    const query = {
      include: {
        host: {
          include: {
            user: includeUserTrustedBy ? { include: { trustedBy: true } } : true,
          },
        },
      },
      where: {
        qualifiers: {
          some: {
            value: {
              in: qualifiers,
            },
          },
        },
      },
    };

    const hostListings = await prisma.hostListing.findMany(query);
    return hostListings;
  },
  async getTenantRequests(hostListingId: string) {
    const tenancyRequest = await prisma.tenantRequestListing.findMany({
      where: {
        hostListingId,
      },
      include: {
        tenantRequest: {
          include: {
            tenant: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return tenancyRequest;
  },
  async acceptTenancyRequestListing(tenancyRequestListingId: string) {
    await prisma.tenantRequestListing.update({
      where: { id: tenancyRequestListingId },
      data: { hostAccepted: true },
    });
  },
};

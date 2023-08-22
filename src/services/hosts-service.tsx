import { prisma } from "@/prisma";
import { mapboxService } from "@/services/mapbox-service";
import { usersService } from "@/services/users-service";
import { calculateTrust } from "@/utils";
import { distance, point } from "@turf/turf";

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
        tenancy: {
          include: {
            moverUsers: true,
            tenant: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return hostListing;
  },

  async getHostListings() {
    // const { qualifiers } = options || {};

    const hostListings = await prisma.hostListing.findMany({
      include: {
        host: {
          include: {
            user: {
              include: {
                trustedBy: true,
              },
            },
          },
        },
        tenancy: true,
        tenantRequestListing: true,
      },
    });
    return hostListings.map((listing) => ({
      ...listing,
      numTenantsRequested: listing.tenantRequestListing.length,
      host: {
        ...listing.host,
        user: {
          ...listing.host.user,
          trustScore: calculateTrust(listing.host.user.trustedBy),
        },
      },
    }));
  },
  async searchHostListings(locationQuery: string, options: { qualifiers: string[] } = { qualifiers: [] }) {
    const coords = await mapboxService.getForwardGeocoding(locationQuery);
    console.log(`${locationQuery}, ${coords.longitude},${coords.latitude}`);
    console.log(options);
    const hostListings = await prisma.hostListing.findMany({
      include: {
        host: {
          include: {
            user: {
              include: {
                trustedBy: true,
              },
            },
          },
        },
        tenancy: true,
        tenantRequestListing: true,
      },
      where:
        options.qualifiers.length > 0
          ? {
              qualifiers: {
                hasSome: options.qualifiers,
              },
            }
          : {},
    });

    const filteredByCoord = hostListings.filter((hl) => {
      const from = point([hl.longitude, hl.latitude]);
      const to = point([coords.longitude, coords.latitude]);
      const distanceBetween = distance(from, to);
      // console.log(distanceBetween);
      // 2 km radius
      return distanceBetween < 2;
    });

    return {
      mapUrl: `https://www.google.com/maps/@${coords.latitude},${coords.longitude},15z?entry=ttu`,
      hostListings: filteredByCoord,
    };
  },

  async getTenantRequests(hostListingId: string) {
    const tenancyRequest = await prisma.tenantRequestListing.findMany({
      where: {
        hostListingId,
      },
      include: {
        hostListing: {
          include: {
            host: {
              include: {
                user: {
                  include: {
                    trustedBy: true,
                  },
                },
              },
            },
            tenancy: true,
          },
        },

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

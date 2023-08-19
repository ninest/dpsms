import { prisma } from "@/prisma";

export const listingsService = {
  async getHostListings() {
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
      },
    });
    return hostListings;
  },
};

import { prisma } from "@/prisma";
import { usersService } from "@/services/users-service";

export const hostsService = {
  async createListing(
    clerkId: string,
    params: {
      timings: string;
      sqft: number;
      qualifiers: string[];
      sizeDescription?: string | undefined;
      image?: string | undefined;
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
  async getMyHostListings(userId: string) {
    const hostListings = await prisma.hostListing.findMany({
      where: {
        host: {
          userId,
        },
      },
    });
    return hostListings;
  },
};
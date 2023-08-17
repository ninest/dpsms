import { prisma } from "@/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const usersService = {
  async getUserByClerkId(clerkId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // TODO: move this to after first sign in
    let dbUser = await prisma.user.upsert({
      where: {
        clerkId,
      },
      update: {},
      create: {
        clerkId: clerkId,
        address: "",
        hostUser: {
          create: {
            isActive: false,
          },
        },
      },
      include: {
        hostUser: true,
      },
    });

    return {
      id: dbUser.id,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      address: dbUser.address,
      isActiveHost: dbUser.hostUser?.isActive ?? false,
    };
  },
  async updateUser(
    userId: string,
    params: { firstName: string; lastName: string; address: string; isActiveHost: boolean }
  ) {
    // TODO: error handling
    const dbUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: params.address,
        hostUser: {
          upsert: {
            update: {
              isActive: params.isActiveHost,
            },
            create: {
              isActive: params.isActiveHost,
            },
          },
        },
      },
    });

    // TODO: error handling
    const clerkUser = await clerkClient.users.updateUser(dbUser.clerkId, {
      firstName: params.firstName,
      lastName: params.lastName,
    });

    return {
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      address: dbUser.address,
    };
  },
  async createUser(params: { email: string; firstName: string; lastName: string; password: string }) {},
  // Determine if the user has completed their profile
  async profileComplete(clerkId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const dbUser = await prisma.user.findUnique({ where: { clerkId: clerkId } });

    return Boolean(clerkUser.firstName) && Boolean(clerkUser.lastName) && Boolean(dbUser?.address);
  },
};

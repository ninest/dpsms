import { prisma } from "@/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const usersService = {
  async getUserByClerkId(clerkId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // TODO: move this to after first sign in
    let dbUser = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: clerkId,
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
  async createUser(params: { email: string; firstName: string; lastName: string; password: string }) {
    
  },
};

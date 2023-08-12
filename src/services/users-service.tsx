import { prisma } from "@/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const usersService = {
  async getUserByClerkId(clerkId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    // TODO: move this to after first sign in
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId,
          address: "",
        },
      });
    }

    return {
      id: dbUser.id,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      address: dbUser.address,
    };
  },
  async updateUser(userId: string, params: { firstName: string; lastName: string; address: string }) {
    // TODO: error handling
    const dbUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: params.address,
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
};

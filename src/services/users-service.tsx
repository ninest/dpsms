import { prisma } from "@/prisma";
import { clerkClient } from "@clerk/nextjs/server";

// TODO: User type
export const usersService = {
  async getUserByClerkId(clerkId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkId);

    let dbUser = await prisma.user.upsert({
      where: {
        clerkId,
      },
      update: {},
      create: {
        clerkId: clerkId,
        address: "",
      },
      include: {
        hostUser: true,
        tenantUser: {
          include: {
            tenancies: {
              include: {
                hostListing: true,
              },
            },
          },
        },
      },
    });

    return {
      id: dbUser.id,
      firstName: clerkUser.firstName ?? "",
      lastName: clerkUser.lastName ?? "",
      address: dbUser.address,
      isActiveHost: dbUser.hostUser?.isActive ?? false,
      hostUser: dbUser.hostUser,
      tenancies: dbUser.tenantUser?.tenancies,
    };
  },
  async getUserById(userId: string) {
    const dbUser = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        hostUser: {
          include: {
            listings: {
              include: {
                tenantRequestListing: {
                  include: {
                    tenantRequest: true,
                  },
                },
              },
            },
          },
        },
        tenantUser: {
          include: {
            requests: {
              include: {
                tenantRequestListing: {
                  include: {
                    hostListing: {
                      include: {
                        host: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        moverUser: true,
      },
    });
    const clerkUser = await clerkClient.users.getUser(dbUser.clerkId);

    return {
      id: dbUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      address: dbUser.address,
      isActiveHost: dbUser.hostUser?.isActive ?? false,
      hostUser: dbUser.hostUser,
      tenantUser: dbUser.tenantUser,
      moverUser: dbUser.moverUser,
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
  async isActiveHost(clerkId: string) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
      include: {
        hostUser: true,
      },
    });
    return Boolean(dbUser?.hostUser?.isActive);
  },
};

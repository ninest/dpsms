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
                hostListing: {
                  include: {
                    tenantRequestListing: true,
                  },
                },
                moverUsers: true,
              },
            },
          },
        },
        moverUser: true,
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
                    hostListing: true,
                  },
                },
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
            tenancies: {
              include: {
                hostListing: {
                  include: {
                    tenantRequestListing: true,
                  },
                },
                moverUsers: true,
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
      clerkId: dbUser.clerkId,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      address: dbUser.address,
      isActiveHost: dbUser.hostUser?.isActive ?? false,
      hostUser: dbUser.hostUser,
      tenantUser: dbUser.tenantUser,
      moverUser: dbUser.moverUser,
      tenancies: dbUser.tenantUser?.tenancies,
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
  async createUser(params: { clerkId: string }) {
    await prisma.user.create({
      data: {
        clerkId: params.clerkId,
        address: "",
      },
    });
  },
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

  async getTrustInfo(userId: string) {
    const dbUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        trustedBy: {
          include: {
            truster: true,
          },
        },
        trusting: {
          include: {
            target: true,
          },
        },
      },
    });
    const trustedBy = await Promise.all(
      dbUser.trustedBy.map(async (trust) => {
        const clerkUser = await clerkClient.users.getUser(trust.truster.clerkId);
        return {
          ...trust,
          truster: {
            ...trust.truster,
            firstName: clerkUser.firstName ?? "",
            lastName: clerkUser.lastName ?? "",
          },
        };
      })
    );
    const trusting = await Promise.all(
      dbUser.trusting.map(async (trust) => {
        const clerkUser = await clerkClient.users.getUser(trust.target.clerkId);
        return {
          ...trust,
          target: {
            ...trust.target,
            firstName: clerkUser.firstName ?? "",
            lastName: clerkUser.lastName ?? "",
          },
        };
      })
    );
    return {
      id: dbUser.id,
      trustedBy,
      trusting,
    };
  },

  async updateTrust(userId: string, targetId: string, amountPercent: number) {
    await prisma.trust.upsert({
      where: {
        trust_unique: {
          trusterId: userId,
          targetId,
        },
      },
      update: {
        amountPercent,
      },
      create: {
        trusterId: userId,
        targetId,
        amountPercent,
      },
    });
  },

  async deleteTrust(userId: string, targetId: string) {
    await prisma.trust.delete({
      where: {
        trust_unique: {
          trusterId: userId,
          targetId,
        },
      },
    });
  },
};

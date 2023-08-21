import { prisma } from "@/prisma";
import { usersService } from "@/services/users-service";

export const moversService = {
  async getMoverTenancies(clerkId: string) {
    const user = await usersService.getUserByClerkId(clerkId);
    const moverUser = await prisma.moverUser.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
      },
      update: {},
      include: {
        tenancies: {
          include: {
            hostListing: true,
            moverUsers: true,
          },
        },
      },
    });
    return moverUser?.tenancies;
  },
  async addMoverToTenancy(clerkId: string, tenancyId: string) {
    const user = await usersService.getUserByClerkId(clerkId);
    await prisma.moverUser.update({
      where: {
        userId: user.id,
      },
      data: {
        tenancies: {
          connect: {
            id: tenancyId,
          },
        },
      },
    });
  },
};

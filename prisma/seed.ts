import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { clerkId: "abcdefgh" },
    update: {},
    create: {
      clerkId: "abcdefgh",
      address: "1 King Street",
      hostUser: {
        create: {
          isActive: true,
          listings: {
            create: [
              {
                address: "1 King Street",
                timings: "9am - 5pm",
                sqft: 1000,
                sizeDescription: "Small",
                qualifiers: [
                  "Has air conditioning",
                  "Is dry",
                  "Allows wet items",
                  "Allows perishables",
                  "Has sunlight",
                  "Has elevator",
                  "Has security",
                  "Is locked",
                  "Can self access",
                ],
              },
              {
                address: "28 Flatiron Way",
                timings: "9am - 5pm",
                sqft: 250,
                sizeDescription: "Quaint little corner in my closet",
                qualifiers: ["Has air conditioning", "Is dry", "Has elevator", "Has security", "Is locked"],
              },

              {
                address: "945 Jackabrian Avenue",
                timings: "6-10pm on weekdays",
                sqft: 100,
                sizeDescription: "Spare room in my brother's car",
                qualifiers: ["Is dry", "Has elevator", "Has security", "Is locked"],
              },
            ],
          },
        },
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { clerkId: "abcabcdef" },
    update: {},
    create: {
      clerkId: "abcabcdef",
      address: "1 Queen Street",
      hostUser: {
        create: {
          isActive: true,
          listings: {
            create: [
              {
                address: "1 Queen Street",
                timings: "10am - 1pm on weekends",
                sqft: 2500,
                sizeDescription: "Huge room in my mom's basement for you to store all your goodies!",
                qualifiers: [
                  "Has air conditioning",
                  "Is dry",
                  "Allows wet items",
                  "Allows perishables",
                  "Has sunlight",
                  "Has elevator",
                  "Has security",
                  "Is locked",
                  "Can self access",
                ],
              },

              {
                address: "9756 Horroscope Avenue",
                timings: "9am - 9pm",
                sqft: 175,
                sizeDescription: "A small spare room in my attic that can fit a few boxes",
                qualifiers: ["Is dry", "Has elevator", "Has security", "Is locked", "Can self access"],
              },

              {
                address: "4625 1st Street",
                timings: "24/7 access",
                sqft: 10000,
                sizeDescription: "Huge warehouse with lots of space",
                qualifiers: ["Is dry", "Allows wet items", "Has security", "Is locked", "Can self access"],
              },

              {
                address: "1234 Water Bottle Avenue",
                timings: "8 pm - 8 am",
                sqft: 50,
                sizeDescription: "Small closet space that can fit a couple boxes or a person if you're able to fit",
                qualifiers: ["Has air conditioning", "Is dry", "Has elevator"],
              },

              {
                address: "1234 Water Bottle Avenue",
                timings: "8 pm - 8 am",
                sqft: 67,
                sizeDescription: "Small area in the basement beside the furnace and washing machines",
                qualifiers: ["Allows wet items", "Has elevator"],
              },
            ],
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

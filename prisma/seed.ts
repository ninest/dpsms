import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alexander = await getOrCreateClerkUser("changdavidson.alexander@gmail.com");
  const parth = await getOrCreateClerkUser("parth.kabra@gmail.com");
  const arjun = await getOrCreateClerkUser("junar9989@gmail.com");
  const james = await getOrCreateClerkUser("chang-davidson.j@husky.neu.edu");

  const alexanderDB = await prisma.user.upsert({
    where: { clerkId: alexander.id },
    update: {},
    create: {
      clerkId: alexander.id,
      address: "1 King Street",
      hostUser: {
        create: {
          isActive: true,
          listings: {
            create: [
              {
                address: "1 King Street",
                longitude: -71.092938,
                latitude: 42.338533,
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
                longitude: -71.092838,
                latitude: 42.338533,
                timings: "9am - 5pm",
                sqft: 250,
                sizeDescription: "Quaint little corner in my closet",
                qualifiers: ["Has air conditioning", "Is dry", "Has elevator", "Has security", "Is locked"],
              },

              {
                address: "945 Jackabrian Avenue",
                longitude: -71.092938,
                latitude: 42.338433,
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

  const parthDB = await prisma.user.upsert({
    where: { clerkId: parth.id },
    update: {},
    create: {
      clerkId: parth.id,
      address: "1 Queen Street",
      hostUser: {
        create: {
          isActive: true,
          listings: {
            create: [
              {
                address: "1 Queen Street",
                longitude: -71.09293,
                latitude: 42.33853,
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
                longitude: -71.092958,
                latitude: 42.338593,
                timings: "9am - 9pm",
                sqft: 175,
                sizeDescription: "A small spare room in my attic that can fit a few boxes",
                qualifiers: ["Is dry", "Has elevator", "Has security", "Is locked", "Can self access"],
              },

              {
                address: "4625 1st Street",
                longitude: -71.093938,
                latitude: 42.335533,
                timings: "24/7 access",
                sqft: 10000,
                sizeDescription: "Huge warehouse with lots of space",
                qualifiers: ["Is dry", "Allows wet items", "Has security", "Is locked", "Can self access"],
              },

              {
                address: "1234 Water Bottle Avenue",
                longitude: -71.192938,
                latitude: 42.238533,
                timings: "8 pm - 8 am",
                sqft: 50,
                sizeDescription: "Small closet space that can fit a couple boxes or a person if you're able to fit",
                qualifiers: ["Has air conditioning", "Is dry", "Has elevator"],
              },

              {
                address: "1234 Water Bottle Avenue",
                longitude: -71.192938,
                latitude: 42.238533,
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

  const arjunDB = await prisma.user.upsert({
    where: { clerkId: arjun.id },
    update: {},
    create: {
      clerkId: arjun.id,
      address: "16 Banana Street",
    },
  });

  const jamesDB = await prisma.user.upsert({
    where: { clerkId: james.id },
    update: {},
    create: {
      clerkId: james.id,
      address: "17 Rocket Ray",
    },
  });

  const trusts = await prisma.trust.createMany({
    data: [
      {
        trusterId: alexanderDB.id,
        targetId: parthDB.id,
        amountPercent: 100,
      },
      {
        trusterId: alexanderDB.id,
        targetId: arjunDB.id,
        amountPercent: 50,
      },
      {
        trusterId: alexanderDB.id,
        targetId: jamesDB.id,
        amountPercent: 75,
      },
      {
        trusterId: parthDB.id,
        targetId: alexanderDB.id,
        amountPercent: 75,
      },
      {
        trusterId: parthDB.id,
        targetId: arjunDB.id,
        amountPercent: 100,
      },
      {
        trusterId: jamesDB.id,
        targetId: alexanderDB.id,
        amountPercent: 100,
      },
    ],
  });
}

// Seems to be no way to get user by email ... so we do it manually
async function getOrCreateClerkUser(email: string) {
  const users = await clerkClient.users.getUserList();
  let user = users.find((user) => {
    const emails = user.emailAddresses.map((ea) => ea.emailAddress);
    return emails.includes(email);
  });
  if (!user) {
    user = await clerkClient.users.createUser({ emailAddress: [email], password: email });
  }
  return user;
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

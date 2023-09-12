import { PRICERANGE, USERCATEGORY } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { fakerFR as faker } from "@faker-js/faker";
import { supabase } from "../../../lib/supabase";

const PASSWORD = "MDP12345*!";
function generateUniqueEmail() {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  return `user${timestamp}${randomNumber}@example.com`;
}

function randomPriceRange() {
  const values = Object.values(PRICERANGE);
  return values[Math.floor(Math.random() * values.length)];
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function createSupabaseUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error creating Supabase user:", error);
    throw error;
  }

  return data?.user?.id;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.queue.deleteMany();
  await prisma.review.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.hairSalon.deleteMany();
  await prisma.location.deleteMany();
  await prisma.owner.deleteMany();
  await deleteAllUsers();

  const owners = [];
  for (let i = 0; i < 5; i++) {
    const ownerEmail = generateUniqueEmail();
    const ownerSupabaseId = await createSupabaseUser(ownerEmail, PASSWORD);
    const owner = await prisma.owner.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: ownerEmail,
        phoneNumber: faker.phone.number(),
        role: USERCATEGORY.OWNER,
        userId: ownerSupabaseId,
      },
    });
    owners.push(owner);
  }

  for (const owner of owners) {
    for (let i = 0; i < 2; i++) {
      const location = await prisma.location.create({
        data: {
          city: faker.location.city(),
          country: "France",
          address: faker.location.streetAddress(),
          zipCode: faker.location.zipCode(),
        },
      });

      const hairSalon = await prisma.hairSalon.create({
        data: {
          name: faker.company.name(),
          mainImage: faker.image.url(),
          images: Array(6).fill(faker.image.url()),
          description: faker.lorem.paragraph(),
          openingTime: faker.date.future(),
          closingTime: faker.date.future(),
          slug: faker.internet.userName(),
          priceRange: randomPriceRange(),
          locationId: location.id,
          ownerId: owner.id,
          email: getRandomNumber(1, 100) + owner.email,
          phoneNumber: faker.phone.number(),
        },
      });

      for (let j = 0; j < 5; j++) {
        const userEmail = generateUniqueEmail();
        const stylistSupabaseId = await createSupabaseUser(userEmail, PASSWORD);
        await prisma.stylist.create({
          data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
            email: userEmail,
            images: Array(6).fill(faker.image.url()),
            mainImage: faker.image.avatar(),
            hairSalonId: hairSalon.id,
            userId: stylistSupabaseId,
            role: USERCATEGORY.STYLIST,
          },
        });
      }

      for (let k = 0; k < 5; k++) {
        const userEmail = generateUniqueEmail();
        const customerSupabaseId = await createSupabaseUser(
          userEmail,
          PASSWORD
        );
        const customer = await prisma.customer.create({
          data: {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            phoneNumber: faker.phone.number(),
            email: userEmail,
            city: faker.location.city(),
            userId: customerSupabaseId,
            role: USERCATEGORY.CUSTOMER,
          },
        });

        await prisma.review.create({
          data: {
            hairSalonId: hairSalon.id,
            customerId: customer.id,
            rating: getRandomNumber(1, 5),
            comment: faker.lorem.sentence(),
          },
        });
      }

      await prisma.service.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          price: faker.commerce.price({ min: 5, max: 100 }),
          hairSalonId: hairSalon.id,
          duration: getRandomNumber(30, 60),
        },
      });
    }
  }

  res.status(200).json({ name: "seed done" });
}

export default handler;

const deleteAllUsers = async () => {
  let page = 1;
  const perPage = 1000;
  let hasMore = true;

  while (hasMore) {
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({ page, perPage });
    console.log("users", users);

    if (error) {
      console.error("Error fetching users from Supabase:", error);
      throw new Error("Error fetching users from Supabase.");
    }

    if (users && users.length > 0) {
      for (let user of users) {
        try {
          await supabase.auth.admin.deleteUser(user.id);
        } catch (err) {
          console.error(`Error deleting user ${user.id}: `, err);
          throw new Error(`Error deleting user ${user.id}.`);
        }
      }
      page++;
    } else {
      hasMore = false;
    }
  }
};

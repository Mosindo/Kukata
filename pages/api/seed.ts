import { PRICERANGE, USERCATEGORY } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { supabase } from "../../lib/supabase";

type Data = {
  name: string;
};

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

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await prisma.queue.deleteMany();
  await prisma.review.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.hairSalon.deleteMany();
  await prisma.location.deleteMany();
  await prisma.owner.deleteMany();

  const imageUrl =
    "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  // Create locations
  const location1 = await prisma.location.create({
    data: {
      city: "Paris",
      country: "France",
      address: "12, Rue de Rivoli",
      zipCode: "75001",
    },
  });

  // Create Owner
  const owner1 = await prisma.owner.create({
    data: {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      phoneNumber: "0123456789",
      role: USERCATEGORY.OWNER,
    },
  });

  // Create a hair salon
  const salon = await prisma.hairSalon.create({
    data: {
      name: "Salon A",
      mainImage: imageUrl,
      images: [
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
      ],
      description: "Salon A description",
      openingTime: new Date("2023-04-12T09:00:00"),
      closingTime: new Date("2023-04-12T18:00:00"),
      slug: "salon-a",
      priceRange: PRICERANGE.MEDIUM,
      locationId: location1.id,
      ownerId: owner1.id,
      email: "salona@hotmail.fr",
    },
  });

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: "Service A",
      description: "Service A description",
      price: "20.00",
      duration: 30,
      hairSalonId: salon.id,
    },
  });

  // Create stylists
  const stylist1 = await prisma.stylist.create({
    data: {
      firstName: "Stylist A",
      lastName: "Smith",
      phoneNumber: "0123456789",
      email: "stylista@example.com",
      images: [
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
        "https://picsum.photos/200",
      ],
      mainImage: imageUrl,
      hairSalonId: salon.id,
      role: USERCATEGORY.STYLIST,
    },
  });

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      firstName: "Customer A",
      lastName: "Williams",
      phoneNumber: "0123456789",
      email: "customerawilliams@example.com",
      city: "Paris",
      role: USERCATEGORY.CUSTOMER,
    },
  });

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      hairSalonId: salon.id,
      customerId: customer1.id,
      rating: 4.5,
      comment: "Great service!",
    },
  });

  // Create queues
  const queue1 = await prisma.queue.create({
    data: {
      hairSalonId: salon.id,
      stylistId: stylist1.id,
      Customer: {
        connect: {
          id: customer1.id,
        },
      },
    },
  });

  res.status(200).json({ name: "seed done" });
}

export default handler;

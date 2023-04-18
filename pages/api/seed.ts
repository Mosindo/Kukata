// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PRICERANGE } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.hairSalon.deleteMany();
  await prisma.location.deleteMany();

  const imageUrl =
    "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  const location1 = await prisma.location.create({
    data: {
      address: "5 Avenue Anatole France",
      zipCode: "75007",
      city: "Paris",
      country: "France",
    },
  });

  const location2 = await prisma.location.create({
    data: {
      address: "Place d'Armes",
      zipCode: "78000",
      city: "Versailles",
      country: "France",
    },
  });

  const salon1 = await prisma.hairSalon.create({
    data: {
      name: "Le Salon de Paris",
      mainImage: imageUrl,
      images: [imageUrl],
      description: "Le meilleur salon de coiffure de Paris",
      openingTime: new Date("2023-01-01T09:00:00"),
      closingTime: new Date("2023-01-01T18:00:00"),
      slug: "le-salon-de-paris",
      priceRange: PRICERANGE.MEDIUM,
      location: {
        connect: {
          id: location1.id,
        },
      },
      phoneNumber: "0123456789",
    },
  });

  const salon2 = await prisma.hairSalon.create({
    data: {
      name: "Château Coiffure",
      mainImage: imageUrl,
      images: [imageUrl],
      description: "Une expérience royale à Versailles",
      openingTime: new Date("2023-01-01T10:00:00"),
      closingTime: new Date("2023-01-01T19:00:00"),
      slug: "chateau-coiffure",
      priceRange: PRICERANGE.EXPENSIVE,
      location: {
        connect: {
          id: location2.id,
        },
      },
      phoneNumber: "0198765432",
    },
  });

  const service1 = await prisma.service.create({
    data: {
      name: "Coupe et coiffage",
      description: "Coupe de cheveux et coiffage",
      price: "30",
      hairSalonId: salon1.id,
      duration: 60,
    },
  });

  await prisma.service.create({
    data: {
      name: "Coloration",
      description: "Coloration des cheveux",
      price: "50",
      hairSalonId: salon2.id,
      duration: 120,
    },
  });

  const stylist1 = await prisma.stylist.create({
    data: {
      firstName: "Sophie",
      lastName: "Dupont",
      phoneNumber: "0612345678",
      email: "sophie.dupont@example.com",
      images: [imageUrl],
      mainImage: imageUrl,
      hairSalonId: salon1.id,
    },
  });

  await prisma.stylist.create({
    data: {
      firstName: "Pierre",
      lastName: "Martin",
      phoneNumber: "0698765432",
      email: "pierre.martin@example.com",
      images: [imageUrl],
      mainImage: imageUrl,
      hairSalonId: salon2.id,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      firstName: "Jeanne",
      lastName: "Moreau",
      phoneNumber: "0687654321",
      email: "jeanne.moreau@example.com",
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date("2023-05-15T15:00:00"),
      customerId: customer1.id,
      stylistId: stylist1.id,
      serviceId: service1.id,
    },
  });

  const review1 = await prisma.review.create({
    data: {
      rating: 4.5,
      comment:
        "Super expérience, le personnel est très professionnel et sympathique.",
      hairSalonId: salon1.id,
      customerId: customer1.id,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      rating: 5.0,
      comment:
        "Meilleur salon de coiffure que j'ai visité jusqu'à présent. Hautement recommandé !",
      hairSalonId: salon1.id,
      customerId: customer1.id,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      rating: 3.0,
      comment: "Service correct, mais l'attente était un peu longue.",
      hairSalonId: salon1.id,
      customerId: customer1.id,
    },
  });

  const review4 = await prisma.review.create({
    data: {
      rating: 4.0,
      comment: "J'aime mon nouveau look ! Merci beaucoup !",
      hairSalonId: salon1.id,
      customerId: customer1.id,
    },
  });

  const review5 = await prisma.review.create({
    data: {
      rating: 2.5,
      comment: "La coupe était bien, mais le salon n'était pas très propre.",
      hairSalonId: salon2.id,
      customerId: customer1.id,
    },
  });

  const review6 = await prisma.review.create({
    data: {
      rating: 4.5,
      comment:
        "Un service exceptionnel et un excellent résultat pour ma coloration.",
      hairSalonId: salon2.id,
      customerId: customer1.id,
    },
  });

  const review7 = await prisma.review.create({
    data: {
      rating: 5.0,
      comment: "Le personnel est très compétent et le salon est magnifique.",
      hairSalonId: salon2.id,
      customerId: customer1.id,
    },
  });

  const review8 = await prisma.review.create({
    data: {
      rating: 3.5,
      comment: "Un peu cher, mais la qualité du service est au rendez-vous.",
      hairSalonId: salon2.id,
      customerId: customer1.id,
    },
  });

  res.status(200).json({ name: "seed done" });
}

export default handler;

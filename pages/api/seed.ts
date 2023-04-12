// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PRICERANGE } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const imageUrl = "https://images.otstatic.com/prod1/49153814/2/medium.jpg";

  const location1 = await prisma.location.create({
    data: {
      name: "5 Avenue Anatole France, 75007 Paris",
    },
  });

  const location2 = await prisma.location.create({
    data: {
      name: "Place d'Armes, 78000 Versailles",
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

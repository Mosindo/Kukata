// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PRICERANGE } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../utils/prisma";

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.hairSalon.deleteMany();

  const imageUrl =
    "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  const locations = [
    {
      city: "Paris",
      country: "France",
      address: "12, Rue de Rivoli",
      zipCode: "75001",
    },
    {
      city: "Lyon",
      country: "France",
      address: "25, Rue de la République",
      zipCode: "69002",
    },
    {
      city: "Marseille",
      country: "France",
      address: "4, Boulevard Charles Livon",
      zipCode: "13007",
    },
  ];

  for (const location of locations) {
    await prisma.location.create({ data: location });
  }

  const salons = [
    {
      name: "Salon A",
      mainImage: imageUrl,
      images: [imageUrl, imageUrl],
      description: "Salon A description",
      openingTime: new Date("2023-04-12T09:00:00"),
      closingTime: new Date("2023-04-12T18:00:00"),
      slug: "salon-a",
      priceRange: PRICERANGE.MEDIUM,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "password123",
      phoneNumber: "0123456789",
      locationId: 1,
    },
    {
      name: "Salon B",
      mainImage: imageUrl,
      images: [imageUrl, imageUrl],
      description: "Salon B description",
      openingTime: new Date("2023-04-12T10:00:00"),
      closingTime: new Date("2023-04-12T19:00:00"),
      slug: "salon-b",
      priceRange: PRICERANGE.CHEAP,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      password: "password123",
      phoneNumber: "0123456789",
      locationId: 2,
    },
    {
      name: "Salon C",
      mainImage: imageUrl,
      images: [imageUrl, imageUrl],
      description: "Salon C description",
      openingTime: new Date("2023-04-12T11:00:00"),
      closingTime: new Date("2023-04-12T20:00:00"),
      slug: "salon-c",
      priceRange: PRICERANGE.EXPENSIVE,
      firstName: "Carol",
      lastName: "Williams",
      email: "carol@example.com",
      password: "password123",
      phoneNumber: "0123456789",
      locationId: 3,
    },
  ];

  for (const salonData of salons) {
    const salon = await prisma.hairSalon.create({ data: salonData });

    // Create services
    const servicesData = [
      {
        name: "Service A",
        description: "Service A description",
        price: "20.00",
        duration: 30,
        hairSalonId: salon.id,
      },
      {
        name: "Service B",
        description: "ServiceB description",
        price: "30.00",
        duration: 45,
        hairSalonId: salon.id,
      },
    ];

    await prisma.service.createMany({ data: servicesData });

    // Create stylists
    const stylistsData = [
      {
        firstName: "Stylist A",
        lastName: "Smith",
        phoneNumber: "0123456789",
        email: `stylista@example.com`,
        password: "password123",
        images: [
          "https://example.com/stylist-a1.jpg",
          "https://example.com/stylist-a2.jpg",
        ],
        mainImage: imageUrl,
        hairSalonId: salon.id,
      },
      {
        firstName: "Stylist B",
        lastName: "Johnson",
        phoneNumber: "0123456789",
        email: `stylistb@example.com`,
        password: "password123",
        images: [
          "https://example.com/stylist-b1.jpg",
          "https://example.com/stylist-b2.jpg",
        ],
        mainImage: imageUrl,
        hairSalonId: salon.id,
      },
    ];

    await prisma.stylist.createMany({ data: stylistsData });

    // Create customers
    const customersData = [
      {
        firstName: "Customer A",
        lastName: "Williams",
        phoneNumber: "0123456789",
        email: "customerawilliams@example.com",
        password: "password123",
        city: "Paris",
      },
      {
        firstName: "Customer B",
        lastName: "Brown",
        phoneNumber: "0123456789",
        email: "customerbbrown@example.com",
        password: "password123",
        city: "Lyon",
      },
      {
        firstName: "Customer C",
        lastName: "Moore",
        phoneNumber: "0123456789",
        email: "customercmoore@example.com",
        password: "password123",
        city: "Marseille",
      },
    ];

    await prisma.customer.createMany({ data: customersData });

    // Create reviews
    const reviewData = [
      {
        hairSalonId: salon.id,
        customerId: 1,
        rating: 4.5,
        comment: "Great service!",
      },
      {
        hairSalonId: salon.id,
        customerId: 2,
        rating: 3.5,
        comment: "Good service, but a bit expensive.",
      },
      {
        hairSalonId: salon.id,
        customerId: 3,
        rating: 5.0,
        comment: "Amazing experience!",
      },
    ];

    for (const review of reviewData) {
      await prisma.review.create({ data: review });
    }

    // Create appointments
    const appointmentData = {
      date: new Date("2023-04-13T10:00:00"),
      customerId: 1,
      stylistId: 1,
      serviceId: 1,
    };

    await prisma.appointment.create({ data: appointmentData });
  }

  res.status(200).json({ name: "seed done" });
}

export default handler;

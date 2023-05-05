import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { HairSalon } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    name,
    mainImage,
    images,
    description,
    openingTime,
    closingTime,
    slug,
    priceRange,
    firstName,
    lastName,
    email,
    userId,
    phoneNumber,
    locationId,
    ownerId,
  } = req.body;

  if (req.method === "POST") {
    try {
      const hairSalonData = {
        name,
        mainImage,
        images,
        description,
        openingTime,
        closingTime,
        slug,
        priceRange,
        firstName,
        lastName,
        email,
        userId,
        phoneNumber,
        ownerId,
        locationId,
      };

      const hairSalon = await prisma.hairSalon.create({
        data: hairSalonData,
      });

      return res.status(201).json(hairSalon);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const hairSalons = await prisma.hairSalon.findMany({
        where: {
          location: {
            id: locationId,
          },
        },
      });
      return res.status(200).json(hairSalons);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

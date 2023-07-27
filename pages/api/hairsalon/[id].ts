import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

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
    email,
    userId,
    phoneNumber,
    locationId,
    ownerId,
  } = req.body;
  const { id } = req.query;
  if (typeof id !== "string" || Array.isArray(id)) {
    return res.status(400).json({ errorMessage: "Invalid id" });
  }
  if (req.method === "PUT" && userId) {
    try {
      const hairSalon = await prisma.hairSalon.update({
        where: {
          id,
        },
        data: {
          name,
          mainImage,
          images,
          description,
          openingTime,
          closingTime,
          slug,
          priceRange,
          email,
          phoneNumber,
          location: {
            connect: { id: locationId },
          },
          owner: {
            connect: { id: ownerId },
          },
        },
      });
      return res.status(200).json(hairSalon);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    try {
      const hairSalon = await prisma.hairSalon.delete({
        where: {
          id,
        },
      });
      return res.status(200).json(hairSalon);
    } catch (error) {
      console.error(error);

      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

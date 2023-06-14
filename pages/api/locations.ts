import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city, country, address, zipCode, hairSalonId } = req.body;
  if (req.method === "POST") {
    try {
      const location = await prisma.location.create({
        data: {
          city,
          country,
          address,
          zipCode,
          hairSalon: {
            connect: { id: hairSalonId },
          },
        },
      });

      return res.status(201).json(location);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const locations = await prisma.location.findMany({
        where: {
          hairSalon: {
            id: hairSalonId,
          },
        },
      });
      return res.status(200).json(locations);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "PUT") {
    try {
      const { id, city, country, address, zipCode } = req.body;
      const location = await prisma.location.update({
        where: {
          id,
        },
        data: {
          city,
          country,
          address,
          zipCode,
        },
      });
      return res.status(200).json(location);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      const location = await prisma.location.delete({
        where: {
          id,
        },
      });
      return res.status(200).json(location);
    } catch (error) {
      console.error(error);

      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

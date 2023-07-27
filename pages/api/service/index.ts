import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, description, price, hairSalonId, duration } = req.body;
  const { id } = req.query;

  // Verify id type once for all
  if (id && typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id parameter." });
  }

  if (req.method === "GET") {
    try {
      const services = await prisma.service.findMany();
      return res.status(200).json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "POST") {
    try {
      const service = await prisma.service.create({
        data: {
          name: name,
          description: description,
          price: price,
          hairSalonId: hairSalonId,
          duration: duration,
        },
      });
      return res.status(201).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }

  return res.status(404).json({ error: "Unknown endpoint" });
}

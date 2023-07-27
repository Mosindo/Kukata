import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { firstName, lastName, email, phoneNumber, hairSalonId } = req.body;

  // Verify id type once for all
  if (id && typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id parameter." });
  }

  if (req.method === "GET") {
    try {
      const stylists = await prisma.stylist.findMany();
      return res.status(200).json(stylists);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "POST") {
    try {
      const stylist = await prisma.stylist.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          hairSalonId: hairSalonId,
        },
      });
      return res.status(201).json(stylist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }
  return res.status(404).json({ error: "Unknown endpoint" });
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, phoneNumber, userId } = req.body;

  if (req.method === "POST" && userId) {
    try {
      const ownerData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        userId,
      };

      const owner = await prisma.owner.create({
        data: ownerData,
      });

      return res.status(201).json(owner);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const owners = await prisma.owner.findMany({
        where: {
          userId: userId,
        },
      });
      return res.status(200).json(owners);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, firstName, lastName, email, phoneNumber, city, userId } =
    req.body;

  if (req.method === "POST" && userId) {
    try {
      const customerData = {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        city,
        userId,
      };

      const customer = await prisma.customer.create({
        data: customerData,
      });

      return res.status(201).json(customer);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const customers = await prisma.customer.findMany({
        where: {
          userId: userId,
        },
      });
      return res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

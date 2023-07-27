import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, phoneNumber } = req.body;
  const { id } = req.query;
  if (id) {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id parameter." });
    }

    if (req.method === "GET") {
      try {
        const owner = await prisma.owner.findUnique({
          where: {
            id: id,
          },
        });
        return res.status(200).json(owner);
      } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
      }
    } else {
      try {
        const owners = await prisma.owner.findMany({
          include: {
            hairSalon: true,
          },
        });
        return res.status(200).json(owners);
      } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
      }
    }
  } else if (req.method === "POST") {
    try {
      const owner = await prisma.owner.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });
      return res.status(201).json(owner);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "PUT") {
    const validFields = ["firstName", "lastName", "email", "phoneNumber"];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      const updatedOwner = await prisma.owner.update({
        where: { id: id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
        },
      });

      return res.status(200).json(updatedOwner);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    try {
      const owner = await prisma.owner.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(owner);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

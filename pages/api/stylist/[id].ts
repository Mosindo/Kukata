import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { firstName, lastName, email, phoneNumber, images, mainImage } =
    req.body;

  // Verify id type once for all
  if (id && typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id parameter." });
  }

  if (req.method === "GET") {
    try {
      const stylist = await prisma.stylist.findUnique({
        where: {
          id: id,
        },
      });
      return res.status(200).json(stylist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    const validFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "images",
      "mainImage",
    ];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      const updatedStylist = await prisma.stylist.update({
        where: { id: id },
        data: {
          ...(lastName && { lastName }),
          ...(email && { email }),
          ...(firstName && { firstName }),
          ...(phoneNumber && { phoneNumber }),
          ...(images && { images }),
          ...(mainImage && { mainImage }),
        },
      });

      return res.status(200).json(updatedStylist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "DELETE") {
    try {
      const stylist = await prisma.stylist.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(stylist);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }

  return res.status(404).json({ error: "Unknown endpoint" });
}

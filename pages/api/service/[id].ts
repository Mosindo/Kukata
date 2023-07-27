import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

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
      const service = await prisma.service.findUnique({
        where: {
          id: id,
        },
      });
      return res.status(200).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    const validFields = [
      "name",
      "description",
      "price",
      "hairSalonId",
      "duration",
    ];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      const updatedService = await prisma.service.update({
        where: { id: id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price }),
          ...(hairSalonId && { hairSalonId }),
          ...(duration && { duration }),
        },
      });

      return res.status(200).json(updatedService);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "DELETE") {
    try {
      const service = await prisma.service.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }

  return res.status(404).json({ error: "Unknown endpoint" });
}

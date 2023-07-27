import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { city, country, address, zipCode, hairSalonId } = req.body;
  const { id } = req.query;
  if (id) {
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id parameter." });
    }
    if (req.method === "GET") {
      try {
        const location = await prisma.location.findUnique({
          where: {
            id: id,
          },
        });
        return res.status(200).json(location);
      } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
      }
    } else {
      try {
        const locations = await prisma.location.findMany();
        return res.status(200).json(locations);
      } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
      }
    }
  } else if (req.method === "PUT") {
    const validFields = [
      "city",
      "country",
      "address",
      "zipCode",
      "hairSalonId",
    ];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      const updatedLocation = await prisma.location.update({
        where: { id: id },
        data: {
          ...(city && { city }),
          ...(country && { country }),
          ...(address && { address }),
          ...(zipCode && { zipCode }),
          ...(hairSalonId && { hairSalonId }),
        },
      });

      return res.status(200).json(updatedLocation);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    try {
      const location = await prisma.location.delete({
        where: {
          id: id,
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

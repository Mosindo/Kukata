import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, phoneNumber, city, userId } = req.body;
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id parameter." });
  }

  if (req.method === "PUT") {
    const validFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "city",
    ];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      let updatedUser;

      if (lastName && email && phoneNumber && city && firstName) {
        // all properties are present, perform a full update (PUT)
        updatedUser = await prisma.customer.update({
          where: { id: id },
          data: { lastName, email, phoneNumber, city, firstName },
        });
      } else {
        // Otherwise, perform a partial update
        updatedUser = await prisma.customer.update({
          where: { id: id },
          data: {
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(firstName && { firstName }),
            ...(phoneNumber && { phoneNumber }),
            ...(city && { city }),
          },
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "GET") {
    try {
      const customer = await prisma.customer.findUnique({
        where: {
          id: id,
        },
      });
      return res.status(200).json(customer);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  } else if (req.method === "DELETE") {
    try {
      const customer = await prisma.customer.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(customer);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }

  return res.status(404).json("Unknown endpoint");
}

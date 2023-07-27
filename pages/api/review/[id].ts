import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { validateRequestBodyFields } from "../../../lib/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hairSalonId, customerId, rating, comment } = req.body;
  const { id } = req.query;

  // Verify id type once for all
  if (id && typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id parameter." });
  }

  if (req.method === "GET") {
    try {
      const reviews = await prisma.review.findMany();
      return res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "PUT") {
    const validFields = ["hairSalonId", "customerId", "rating", "comment"];
    const validation = validateRequestBodyFields(req, validFields);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ error: `Invalid field: ${validation.invalidField}` });
    }

    try {
      const updatedReview = await prisma.review.update({
        where: { id: id },
        data: {
          ...(hairSalonId && { hairSalonId }),
          ...(customerId && { customerId }),
          ...(rating && { rating }),
          ...(comment && { comment }),
        },
      });

      return res.status(200).json(updatedReview);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  } else if (req.method === "DELETE") {
    try {
      const review = await prisma.review.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(review);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }

  return res.status(404).json({ error: "Unknown endpoint" });
}

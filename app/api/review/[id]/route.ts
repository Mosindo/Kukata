import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { validateRequestBodyFields } from "../../../../lib/helpers";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { hairSalonId, customerId, rating, comment } = req.body;
//   const { id } = req.query;

//   // Verify id type once for all
//   if (id && typeof id !== "string") {
//     return res.status(400).json({ error: "Invalid id parameter." });
//   }

//   if (req.method === "GET") {
//     try {
//       const reviews = await prisma.review.findMany();
//       return res.status(200).json(reviews);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: error });
//     }
//   } else if (req.method === "PUT") {
//     const validFields = ["hairSalonId", "customerId", "rating", "comment"];
//     const validation = validateRequestBodyFields(req, validFields);
//     if (!validation.isValid) {
//       return res
//         .status(400)
//         .json({ error: `Invalid field: ${validation.invalidField}` });
//     }

//     try {
//       const updatedReview = await prisma.review.update({
//         where: { id: id },
//         data: {
//           ...(hairSalonId && { hairSalonId }),
//           ...(customerId && { customerId }),
//           ...(rating && { rating }),
//           ...(comment && { comment }),
//         },
//       });

//       return res.status(200).json(updatedReview);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: error });
//     }
//   } else if (req.method === "DELETE") {
//     try {
//       const review = await prisma.review.delete({
//         where: {
//           id: id,
//         },
//       });
//       return res.status(200).json(review);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: error });
//     }
//   }

//   return res.status(404).json({ error: "Unknown endpoint" });
// }

export async function GET(req: Request) {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { hairSalonId, customerId, rating, comment } = await req.json();
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  if (id && typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid id parameter." },
      { status: 400 }
    );
  }

  const validFields = ["hairSalonId", "customerId", "rating", "comment"];
  const validation = validateRequestBodyFields(req, validFields);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: `Invalid field: ${validation.invalidField}` },
      { status: 400 }
    );
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

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  if (id && typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid id parameter." },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

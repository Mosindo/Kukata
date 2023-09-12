import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { validateRequestBodyFields } from "../../../../lib/helpers";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const {
//     name,
//     mainImage,
//     images,
//     description,
//     openingTime,
//     closingTime,
//     slug,
//     priceRange,
//     email,
//     userId,
//     phoneNumber,
//     locationId,
//     ownerId,
//   } = req.body;
//   const { id } = req.query;
//   if (typeof id !== "string" || Array.isArray(id)) {
//     return res.status(400).json({ errorMessage: "Invalid id" });
//   }
//   if (req.method === "PUT" && userId) {
//     try {
//       const hairSalon = await prisma.hairSalon.update({
//         where: {
//           id,
//         },
//         data: {
//           name,
//           mainImage,
//           images,
//           description,
//           openingTime,
//           closingTime,
//           slug,
//           priceRange,
//           email,
//           phoneNumber,
//           location: {
//             connect: { id: locationId },
//           },
//           owner: {
//             connect: { id: ownerId },
//           },
//         },
//       });
//       return res.status(200).json(hairSalon);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   } else if (req.method === "DELETE") {
//     try {
//       const hairSalon = await prisma.hairSalon.delete({
//         where: {
//           id,
//         },
//       });
//       return res.status(200).json(hairSalon);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json("Internal Server Error");
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }

export async function GET(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);
  if (typeof id !== "string" || Array.isArray(id)) {
    return NextResponse.json(
      { error: "Invalid id parameter." },
      { status: 400 }
    );
  }
  try {
    const hairSalon = await prisma.hairSalon.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(hairSalon, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const data = await req.json();
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  const validFields = [
    "name",
    "mainImage",
    "images",
    "description",
    "openingTime",
    "closingTime",
    "slug",
    "priceRange",
    "email",
    "phoneNumber",
    "locationId",
    "ownerId",
  ];

  const validation = validateRequestBodyFields(req, validFields);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: `Invalid field: ${validation.invalidField}` },
      {
        status: 400,
      }
    );
  }

  // Build the update data object dynamically
  let updateData: { [key: string]: any } = {};
  validFields.forEach((field) => {
    if (data[field]) {
      if (field === "locationId") {
        updateData["location"] = { connect: { id: data[field] } };
      } else if (field === "ownerId") {
        updateData["owner"] = { connect: { id: data[field] } };
      } else {
        updateData[field] = data[field];
      }
    }
  });

  try {
    const hairSalon = await prisma.hairSalon.update({
      where: {
        id,
      },
      data: updateData,
    });
    return NextResponse.json(hairSalon, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);
  try {
    const hairSalon = await prisma.hairSalon.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(hairSalon, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

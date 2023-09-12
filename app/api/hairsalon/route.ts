import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

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
//     firstName,
//     lastName,
//     email,
//     userId,
//     phoneNumber,
//     locationId,
//     ownerId,
//   } = req.body;

//   if (req.method === "POST" && userId) {
//     try {
//       const hairSalonData = {
//         name,
//         mainImage,
//         images,
//         description,
//         openingTime,
//         closingTime,
//         slug,
//         priceRange,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         ownerId,
//         locationId,
//       };

//       const hairSalon = await prisma.hairSalon.create({
//         data: hairSalonData,
//       });

//       return res.status(201).json(hairSalon);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   } else if (req.method === "GET") {
//     try {
//       const hairSalons = await prisma.hairSalon.findMany({
//         where: {
//           location: {
//             id: locationId,
//           },
//         },
//       });
//       return res.status(200).json(hairSalons);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }

export async function GET() {
  const hairSalon = await prisma.hairSalon.findMany();
  try {
    return NextResponse.json(hairSalon, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { ownerId } = data;
  if (ownerId) {
    try {
      const hairSalon = await prisma.customer.create({
        data: data,
      });

      return NextResponse.json(hairSalon, {
        status: 201,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json("Internal Server Error", {
        status: 500,
      });
    }
  }
  return NextResponse.json("Unknown endpoint", {
    status: 404,
  });
}

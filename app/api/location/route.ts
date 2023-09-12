import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { city, country, address, zipCode, hairSalonId } = req.body;
//   if (req.method === "POST") {
//     try {
//       const location = await prisma.location.create({
//         data: {
//           city,
//           country,
//           address,
//           zipCode,
//           hairSalon: {
//             connect: { id: hairSalonId },
//           },
//         },
//       });

//       return res.status(201).json(location);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   } else if (req.method === "GET") {
//     try {
//       const locations = await prisma.location.findMany({
//         where: {
//           hairSalon: {
//             id: hairSalonId,
//           },
//         },
//       });
//       return res.status(200).json(locations);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }

export async function POST(req: Request) {
  const { city, country, address, zipCode, hairSalonId } = await req.json();

  try {
    const location = await prisma.location.create({
      data: {
        city,
        country,
        address,
        zipCode,
        hairSalon: {
          connect: { id: hairSalonId },
        },
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { hairSalonId } = await req.json();

  try {
    const locations = await prisma.location.findMany({
      where: {
        hairSalon: {
          id: hairSalonId,
        },
      },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

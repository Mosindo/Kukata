import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { firstName, lastName, email, phoneNumber, userId } = req.body;

//   if (req.method === "POST" && userId) {
//     try {
//       const ownerData = {
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         userId,
//       };

//       const owner = await prisma.owner.create({
//         data: ownerData,
//       });

//       return res.status(201).json(owner);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   } else if (req.method === "GET") {
//     try {
//       const owners = await prisma.owner.findMany({
//         where: {
//           userId: userId,
//         },
//       });
//       return res.status(200).json(owners);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }

export async function POST(req: Request) {
  const { firstName, lastName, email, phoneNumber, userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const ownerData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
    };

    const owner = await prisma.owner.create({
      data: ownerData,
    });

    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  const owner = await prisma.owner.findMany();
  try {
    return NextResponse.json(owner, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}

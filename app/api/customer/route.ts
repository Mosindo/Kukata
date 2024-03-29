import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { id, firstName, lastName, email, phoneNumber, city, userId } =
//     req.body;

//   if (req.method === "POST" && userId) {
//     try {
//       const customerData = {
//         id,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         city,
//         userId,
//       };

//       const customer = await prisma.customer.create({
//         data: customerData,
//       });

//       return res.status(201).json(customer);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   } else if (req.method === "GET") {
//     try {
//       const customers = await prisma.customer.findMany({
//         where: {
//           userId: userId,
//         },
//       });
//       return res.status(200).json(customers);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json("Internal Server Error");
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }
export async function GET() {
  const customers = await prisma.customer.findMany();
  try {
    return NextResponse.json(customers, {
      status: 200,
      // headers: {
      //   'Access-Control-Allow-Origin': '*',
      //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      //   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      // },
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
  const { userId, firstName, lastName, email, phoneNumber, city } = data;
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    if (existingCustomer) {
      return NextResponse.json("User already exists", {
        status: 409,
      });
    }

    const customerData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      city,
      userId,
    };

    const customer = await prisma.customer.create({
      data: data,
    });

    return NextResponse.json(customer, {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
    });
  }
}

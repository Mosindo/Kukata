import validator from "validator";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const errors: string[] = [];
//     const { email, password, data } = req.body;

//     const validationSchema = [
//       {
//         valid: validator.isEmail(email),
//         errorMessage: "Email is invalid",
//       },
//       {
//         valid: validator.isLength(password, {
//           min: 1,
//         }),
//         errorMessage: "Password is invalid",
//       },
//     ];

//     validationSchema.forEach((check) => {
//       if (!check.valid) {
//         errors.push(check.errorMessage);
//       }
//     });

//     if (errors.length) {
//       return res.status(400).json({ errorMessage: errors[0] });
//     }

//     const customer = await prisma.customer.findUnique({
//       where: {
//         email,
//       },
//     });

//     const owner = await prisma.owner.findUnique({
//       where: {
//         email,
//       },
//     });

//     const stylist = await prisma.stylist.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (customer) {
//       return res.status(200).json({
//         firstName: customer.firstName,
//         lastName: customer.lastName,
//         email: customer.email,
//         phoneNumber: customer.phoneNumber,
//         city: customer.city,
//         role: data.session?.user.role,
//       });
//     } else if (owner) {
//       return res.status(200).json({
//         firstName: owner.firstName,
//         lastName: owner.lastName,
//         email: owner.email,
//         phoneNumber: owner.phoneNumber,
//         role: data.session?.user.role,
//       });
//     } else if (stylist) {
//       return res.status(200).json({
//         firstName: stylist.firstName,
//         lastName: stylist.lastName,
//         email: stylist.email,
//         phoneNumber: stylist.phoneNumber,
//         hairSalonId: stylist.hairSalonId,
//         role: data.session?.user.role,
//       });
//     }
//   }

//   return res.status(404).json("Unknown endpoint");
// }

export async function POST(req: Request) {
  const errors: string[] = [];
  const { email, password, data } = await req.json();

  const validationSchema = [
    {
      valid: validator.isEmail(email),
      errorMessage: "Email is invalid",
    },
    {
      valid: validator.isLength(password, {
        min: 1,
      }),
      errorMessage: "Password is invalid",
    },
  ];

  validationSchema.forEach((check) => {
    if (!check.valid) {
      errors.push(check.errorMessage);
    }
  });

  if (errors.length) {
    return NextResponse.json({ errorMessage: errors[0] }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  const owner = await prisma.owner.findUnique({
    where: {
      email,
    },
  });

  const stylist = await prisma.stylist.findUnique({
    where: {
      email,
    },
  });

  if (customer) {
    return NextResponse.json(
      {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        city: customer.city,
        role: data.session?.user.role,
      },
      { status: 200 }
    );
  } else if (owner) {
    return NextResponse.json(
      {
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phoneNumber: owner.phoneNumber,
        role: data.session?.user.role,
      },
      { status: 200 }
    );
  } else if (stylist) {
    return NextResponse.json(
      {
        firstName: stylist.firstName,
        lastName: stylist.lastName,
        email: stylist.email,
        phoneNumber: stylist.phoneNumber,
        hairSalonId: stylist.hairSalonId,
        role: data.session?.user.role,
      },
      { status: 200 }
    );
  }
}

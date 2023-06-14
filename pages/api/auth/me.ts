import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("auth.me", req.method);
  // const bearerToken = req.headers["authorization"];
  // if (!bearerToken) {
  //   return res
  //     .status(401)
  //     .json({ errorMessage: "Unauthorized request (no bearer)" });
  // }

  // const token = bearerToken.split(" ")[1];

  // if (!token) {
  //   return res.status(401).json({ errorMessage: "Unauthorized request" });
  // }
  // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  // try {
  //   await jose.jwtVerify(token, secret);
  // } catch (error) {
  //   return res.status(401).json({ errorMessage: "Unauthorized request" });
  // }
  // const payload = jwt.decode(token) as { email: string };

  // if (!payload.email) {
  //   return res.status(401).json({ errorMessage: "Unauthorized request" });
  // }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("session!!! :", session);
  const customer = await prisma.customer.findUnique({
    where: {
      email: session?.user.email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      city: true,
      role: true,
    },
  });

  if (!customer)
    return res.status(401).json({ errorMessage: "Unauthorized request" });

  return res.status(200).json({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    city: customer.city,
    role: customer.role,
  });
}

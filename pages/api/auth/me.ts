import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import prisma from "../../../utils/prisma";

export default async function hhandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    return res
      .status(401)
      .json({ errorMessage: "Unauthorized request (no bearer)" });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errorMessage: "Unauthorized request" });
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return res.status(401).json({ errorMessage: "Unauthorized request" });
  }
  const payload = jwt.decode(token) as { email: string };

  if (!payload.email) {
    return res.status(401).json({ errorMessage: "Unauthorized request" });
  }

  const customer = await prisma.customer.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      city: true,
    },
  });

  return res.status(200).json({ customer });
}

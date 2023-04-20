import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, phoneNumber, city } =
      req.body;
    const errors: string[] = [];
    const validatorSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name must be between 1 and 20 characters",
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "last name must be between 1 and 20 characters",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is not valid",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
      },
      {
        valid: validator.isMobilePhone(phoneNumber),
        errorMessage: "Phone number must be 10 characters",
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: "City must be between 1 and 20 characters",
      },
    ];

    validatorSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const customerWithSameEmail = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (customerWithSameEmail) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        city,
      },
    });
    const alg = "HS256";

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: customer.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
  }
  return res.status(404).json("Unknown endpoint");
}

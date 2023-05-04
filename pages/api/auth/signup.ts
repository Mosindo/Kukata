import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import prisma from "../../../lib/prisma";
import { setCookie } from "cookies-next";
import { supabase } from "../../../lib/supabase";
import { USERCATEGORY } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      city,
      role,
      hairSalonId,
    } = req.body;
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ errorMessage: error.message });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    if (role === USERCATEGORY.CUSTOMER) {
      const customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          city,
          userId: data.user?.id,
          // password: hashedPassword,
        },
      });

      // const alg = "HS256";

      // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      // const token = await new jose.SignJWT({ email: customer.email })
      //   .setProtectedHeader({ alg })
      //   .setExpirationTime("24h")
      //   .sign(secret);
      const token = data.session?.access_token;

      setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
      return res.status(200).json({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phoneNumber,
        city: customer.city,
      });
    } else if (role === USERCATEGORY.STYLIST) {
      const stylist = await prisma.stylist.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          userId: data.user?.id,
          hairSalonId,
        },
      });

      const token = data.session?.access_token;

      setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
      return res.status(200).json({
        firstName: stylist.firstName,
        lastName: stylist.lastName,
        email: stylist.email,
        phone: stylist.phoneNumber,
        hairSalonId: stylist.hairSalonId,
      });
    } else if (role === USERCATEGORY.OWNER) {
      const owner = await prisma.owner.create({
        data: {
          firstName,
          lastName,
          email,
          userId: data.user?.id,
          phoneNumber,
        },
      });

      const token = data.session?.access_token;

      setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
      return res.status(200).json({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phoneNumber,
      });
    }
  }
  return res.status(404).json("Unknown endpoint");
}

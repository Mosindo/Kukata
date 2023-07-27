import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import prisma from "../../../lib/prisma";
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
      data,
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
        valid: city ? validator.isLength(city, { min: 1 }) : true,
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

    const stylistWithSameEmail = await prisma.stylist.findUnique({
      where: {
        email,
      },
    });

    const ownerWithSameEmail = await prisma.owner.findUnique({
      where: {
        email,
      },
    });

    if (customerWithSameEmail || stylistWithSameEmail || ownerWithSameEmail) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }

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

      return res.status(200).json({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phoneNumber,
        city: customer.city,
      });
    } else if (role === USERCATEGORY.STYLIST) {
      if (!hairSalonId) {
        return res
          .status(400)
          .json({ errorMessage: "A hair salon ID is required for a stylist" });
      }

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

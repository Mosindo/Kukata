import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { setCookie } from "cookies-next";
import prisma from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const errors: string[] = [];
    const { email, password } = req.body;

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
      return res.status(400).json({ errorMessage: errors[0] });
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

    // if (!customer || !owner || !stylist) {
    //   return res.status(401).json({
    //     errorMessage: "Email or password is invalid",
    //   });
    // }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ errorMessage: error.message });
    }
    // const isMatch = await bcrypt.compare(password, customer.password);

    // if (!isMatch) {
    //   return res
    //     .status(401)
    //     .json({ errorMessage: "Email or password is invalid" });
    // }

    // const alg = "HS256";

    // const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // const token = await new jose.SignJWT({ email: customer.email })
    //   .setProtectedHeader({ alg })
    //   .setExpirationTime("24h")
    //   .sign(secret);
    const token = data.session?.access_token;
    console.log(data.session);
    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 });
    if (customer) {
      return res.status(200).json({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        city: customer.city,
        role: data.session?.user.role,
      });
    } else if (owner) {
      return res.status(200).json({
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phoneNumber: owner.phoneNumber,
        role: data.session?.user.role,
      });
    } else if (stylist) {
      return res.status(200).json({
        firstName: stylist.firstName,
        lastName: stylist.lastName,
        email: stylist.email,
        phoneNumber: stylist.phoneNumber,
        hairSalonId: stylist.hairSalonId,
        role: data.session?.user.role,
      });
    }
  }

  return res.status(404).json("Unknown endpoint");
}

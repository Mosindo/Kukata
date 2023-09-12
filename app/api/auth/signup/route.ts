import validator from "validator";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

const USERCATEGORY = {
  CUSTOMER: "CUSTOMER",
  STYLIST: "STYLIST",
  OWNER: "OWNER",
};

export async function POST(req: Request) {
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
  } = await req.json();
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
    return NextResponse.json({ errorMessage: errors[0] }, { status: 400 });
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
    return NextResponse.json(
      { errorMessage: "Email already exists" },
      { status: 400 }
    );
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
      },
    });

    return NextResponse.json(
      {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phoneNumber,
        city: customer.city,
      },
      { status: 200 }
    );
  } else if (role === USERCATEGORY.STYLIST) {
    if (!hairSalonId) {
      return NextResponse.json(
        { errorMessage: "A hair salon ID is required for a stylist" },
        { status: 400 }
      );
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

    return NextResponse.json(
      {
        firstName: stylist.firstName,
        lastName: stylist.lastName,
        email: stylist.email,
        phone: stylist.phoneNumber,
        hairSalonId: stylist.hairSalonId,
      },
      { status: 200 }
    );
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

    return NextResponse.json(
      {
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        phone: owner.phoneNumber,
      },
      { status: 200 }
    );
  }

  return NextResponse.json("Unknown endpoint", { status: 404 });
}

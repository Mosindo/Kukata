import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const stylists = await prisma.stylist.findMany();
    return NextResponse.json(stylists, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { firstName, lastName, email, phoneNumber, hairSalonId } =
    await req.json();

  try {
    const stylist = await prisma.stylist.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        hairSalonId: hairSalonId,
      },
    });
    return NextResponse.json(stylist, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

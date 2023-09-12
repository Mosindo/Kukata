import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, description, price, hairSalonId, duration } = await req.json();

  try {
    const service = await prisma.service.create({
      data: {
        name: name,
        description: description,
        price: price,
        hairSalonId: hairSalonId,
        duration: duration,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

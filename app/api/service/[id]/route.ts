import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { validateRequestBodyFields } from "../../../../lib/helpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  if (typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid id parameter." },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.service.findUnique({
      where: {
        id: id,
      },
    });
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { name, description, price, hairSalonId, duration } = await req.json();
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  const validFields = [
    "name",
    "description",
    "price",
    "hairSalonId",
    "duration",
  ];
  const validation = validateRequestBodyFields(req, validFields);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: `Invalid field: ${validation.invalidField}` },
      { status: 400 }
    );
  }

  try {
    const updatedService = await prisma.service.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(hairSalonId && { hairSalonId }),
        ...(duration && { duration }),
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  try {
    const service = await prisma.service.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

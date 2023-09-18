import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { validateRequestBodyFields } from "../../../../lib/helpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  // Verify id type once for all
  if (id && typeof id !== "string") {
    return NextResponse.json(
      { error: "Invalid id parameter." },
      { status: 400 }
    );
  }

  try {
    const stylist = await prisma.stylist.findUnique({
      where: {
        userId: id,
      },
    });
    return NextResponse.json(stylist, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);
  const { firstName, lastName, email, phoneNumber, images, mainImage } =
    await req.json();

  const validFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "images",
    "mainImage",
  ];
  const validation = validateRequestBodyFields(req, validFields);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: `Invalid field: ${validation.invalidField}` },
      { status: 400 }
    );
  }

  try {
    const updatedStylist = await prisma.stylist.update({
      where: { id: id },
      data: {
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(phoneNumber && { phoneNumber }),
        ...(images && { images }),
        ...(mainImage && { mainImage }),
      },
    });

    return NextResponse.json(updatedStylist, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = req.url.slice(req.url.lastIndexOf("/") + 1);

  try {
    const stylist = await prisma.stylist.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(stylist, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

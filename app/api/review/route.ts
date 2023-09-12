import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { hairSalonId, customerId, rating, comment } = await req.json();

  try {
    const review = await prisma.review.create({
      data: {
        hairSalonId: hairSalonId,
        customerId: customerId,
        rating: rating,
        comment: comment,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

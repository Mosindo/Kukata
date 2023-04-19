import BarberNavbar from "./components/BarberNavbar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { PRICERANGE, Location, Review } from "@prisma/client";
import { notFound } from "next/navigation";
import prisma from "../../../utils/prisma";

interface HairSalonType {
  name: string;
  id: number;
  mainImage: string;
  images: string[];
  description: string;
  slug: string;
  priceRange: PRICERANGE;
  location: Location;
  reviews: Review[];
}
const fetchHairSalonBySlug = async (slug: string): Promise<HairSalonType> => {
  const hairSalon = await prisma.hairSalon.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      location: true,
      description: true,
      mainImage: true,
      images: true,
      slug: true,
      priceRange: true,
      reviews: true,
    },
  });

  if (!hairSalon) {
    notFound();
  }

  return hairSalon;
};

export default async function BarberDetails({
  params,
}: {
  params: { slug: string };
}) {
  const hairSalon = await fetchHairSalonBySlug(params.slug);
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <BarberNavbar slug={hairSalon.slug} />
        <Title name={hairSalon.name} />
        <Rating reviews={hairSalon.reviews} />
        <Description description={hairSalon.description} />
        <Images images={hairSalon.images} />
        <Reviews reviews={hairSalon.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard />
      </div>
    </>
  );
}

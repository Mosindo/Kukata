import Header from "./components/Header";
import BarberCard from "./components/BarberCard";
import { Location, PRICERANGE, Review } from "@prisma/client";
import prisma from "../lib/prisma";
import { supabase } from "../lib/supabase";

export interface HairSalonCardType {
  id: string;
  name: string;
  location: Location | null;
  description: string | null;
  mainImage: string | null;
  priceRange: PRICERANGE | null;
  slug: string;
  reviews: Review[];
}

const fetchHairSalons = async (): Promise<HairSalonCardType[]> => {
  const hairSalons = await prisma.hairSalon.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      mainImage: true,
      slug: true,
      priceRange: true,
      location: {
        select: {
          id: true,
          city: true,
          country: true,
          address: true,
          zipCode: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      reviews: {
        select: {
          id: true,
          hairSalonId: true,
          customerId: true,
          rating: true,
          comment: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return hairSalons;
};

export default async function Home() {
  const hairSalons = await fetchHairSalons();

  return (
    <main>
      <Header /> {/* CARDS */}
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {hairSalons.map((hairSalon) => (
          <BarberCard hairSalon={hairSalon} key={hairSalon.id} />
        ))}
      </div>
      {/* CARDS */}
    </main>
  );
}

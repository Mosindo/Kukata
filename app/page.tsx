import Header from "./components/Header";
import BarberCard from "./components/BarberCard";
import { PrismaClient, Location, PRICERANGE } from "@prisma/client";

const prisma = new PrismaClient();

export interface HairSalonCardType {
  id: number;
  name: string;
  location: Location;
  description: string;
  mainImage: string;
  priceRange: PRICERANGE;
  slug: string;
}

const fetchHairSalons = async (): Promise<HairSalonCardType[]> => {
  const hairSalons = await prisma.hairSalon.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      description: true,
      mainImage: true,
      slug: true,
      priceRange: true,
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

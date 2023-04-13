import { PrismaClient } from "@prisma/client";
import BarberCard from "./components/BarberCard";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";

const prisma = new PrismaClient();
function searchSalons(searchTerm: string | undefined) {
  const select = {
    id: true,
    name: true,
    mainImage: true,
    slug: true,
    priceRange: true,
    location: true,
  };
  if (!searchTerm) return prisma.hairSalon.findMany({ select });

  const res = prisma.hairSalon.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { location: { city: { contains: searchTerm, mode: "insensitive" } } },
        {
          location: { country: { contains: searchTerm, mode: "insensitive" } },
        },
        { location: { zipCode: { contains: searchTerm } } },
      ],
    },
    select,
  });
  return res;
}

const fetchLocation = async () => {
  const location = await prisma.location.findMany({
    select: {
      city: true,
      country: true,
      zipCode: true,
    },
  });
  return location;
};

const fetchPriceRange = async () => {
  const priceRange = await prisma.hairSalon.findMany({
    select: {
      priceRange: true,
    },
  });
  return priceRange;
};

export default async function Search({
  searchParams,
}: {
  searchParams: { searchTerm: string };
}) {
  const hairSalons = await searchSalons(searchParams.searchTerm);
  const location = await fetchLocation();
  const priceRange = await fetchPriceRange();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar locations={location} prices={priceRange} />
        <div className="w-5/6">
          {hairSalons.length ? (
            <>
              {hairSalons.map((hairSalon) => (
                <BarberCard hairSalon={hairSalon} key={hairSalon.id} />
              ))}
            </>
          ) : (
            <p>Sorry, we found no result</p>
          )}
        </div>
      </div>
    </>
  );
}

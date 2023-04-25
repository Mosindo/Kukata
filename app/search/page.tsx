import { PRICERANGE, PrismaClient } from "@prisma/client";
import BarberCard from "./components/BarberCard";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import prisma from "../../lib/prisma";

export interface SearchParams {
  searchTerm?: string;
  price?: PRICERANGE;
  city?: string;
}

const searchSalons = (searchParams: SearchParams) => {
  let where: any = {};

  if (searchParams.city) {
    where.location = {
      city: {
        contains: searchParams.city,
        mode: "insensitive",
      },
    };
  }

  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.priceRange = price;
  }

  if (searchParams.searchTerm) {
    where.OR = [
      { name: { contains: searchParams.searchTerm, mode: "insensitive" } },
      {
        location: {
          city: { contains: searchParams.searchTerm, mode: "insensitive" },
        },
      },
      {
        location: {
          country: {
            contains: searchParams.searchTerm,
            mode: "insensitive",
          },
        },
      },
      { location: { zipCode: { contains: searchParams.searchTerm } } },
    ];
  }

  const select = {
    id: true,
    name: true,
    mainImage: true,
    priceRange: true,
    location: true,
    slug: true,
    reviews: true,
  };

  return prisma.hairSalon.findMany({
    where,
    select,
  });
};

const fetchLocation = async () => {
  const location = await prisma.location.findMany();
  return location;
};

export default async function Search({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const hairSalons = await searchSalons(searchParams);
  const location = await fetchLocation();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar locations={location} searchParams={searchParams} />
        <div className="w-5/6">
          {hairSalons?.length ? (
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

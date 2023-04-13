import { PrismaClient } from "@prisma/client";
import BarberNavbar from "../components/BarberNavbar";
import Services from "../components/Services";

const prisma = new PrismaClient();

const fetchHairSalonBySlug = async (slug: string) => {
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
      services: true,
    },
  });

  if (!hairSalon) throw new Error("No hair salon found with that slug");

  return hairSalon.services;
};

export default async function BarberServices({
  params,
}: {
  params: { slug: string };
}) {
  const services = await fetchHairSalonBySlug(params.slug);
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <BarberNavbar slug={params.slug} />
        <Services services={services} />
      </div>
    </>
  );
}

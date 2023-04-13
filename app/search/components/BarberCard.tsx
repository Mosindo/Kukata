import { PRICERANGE, Location } from "@prisma/client";
import Link from "next/link";
import React from "react";
import Price from "../../components/Price";
import Image from "next/image";

interface BarberCardProps {
  slug: string;
  id: number;
  name: string;
  location: Location;
  mainImage: string;
  priceRange: PRICERANGE;
}
const BarberCard = ({ hairSalon }: { hairSalon: BarberCardProps }) => {
  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={hairSalon.mainImage} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{hairSalon.name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">*****</div>
          <p className="ml-2 text-sm">Awesome</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={hairSalon.priceRange} />
            <p className="mr-4">Mexican</p>
            <p className="mr-4">
              {`
                ${hairSalon.location.address}, ${hairSalon.location.zipCode} ${hairSalon.location.city}`}
            </p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`hairSalon/${hairSalon.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BarberCard;

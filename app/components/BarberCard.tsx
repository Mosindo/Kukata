import Link from "next/link";
import React from "react";
import { HairSalonCardType } from "../page";
import Price from "./Price";

interface HairSalon {
  hairSalon: HairSalonCardType;
}

const BarberCard = ({ hairSalon }: HairSalon) => {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/barber/${hairSalon.slug}`}>
        <img src={hairSalon.mainImage} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{hairSalon.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">77 reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <Price price={hairSalon.priceRange} />
            <p>{hairSalon.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
};

export default BarberCard;

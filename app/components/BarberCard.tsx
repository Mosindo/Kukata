import Link from "next/link";
import React from "react";
import { HairSalonCardType } from "../page";
import Price from "./Price";
import Stars from "./Stars";

interface HairSalon {
  hairSalon: HairSalonCardType;
}

const BarberCard = ({ hairSalon }: HairSalon) => {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/hairSalon/${hairSalon.slug}`}>
        <img
          src={hairSalon.mainImage}
          alt=""
          className="w-full h-36"
          width={300}
          height={500}
        />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{hairSalon.name}</h3>
          <div className="flex items-start">
            <Stars reviews={hairSalon.reviews} />
            <p className="ml-2">
              {hairSalon.reviews.length} review
              {hairSalon.reviews.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <Price price={hairSalon.priceRange} />
            <p>{hairSalon.location.city}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
};

export default BarberCard;

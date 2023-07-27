import { PRICERANGE, Location, Review } from "@prisma/client";
import Link from "next/link";
import React from "react";
import Price from "../../components/Price";
import { calculateReviewRatingAverage } from "../../../lib/calculateReviewRateAverage";
import Stars from "../../components/Stars";

interface BarberCardProps {
  slug: string;
  id: string;
  name: string;
  location: Location;
  mainImage: string;
  priceRange: PRICERANGE;
  reviews: Review[];
}
const BarberCard = ({ hairSalon }: { hairSalon: BarberCardProps }) => {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(hairSalon.reviews) as number;

    if (rating > 4) return "Awesome";
    else if (rating <= 4 && rating > 3) return "Good";
    else if (rating <= 3 && rating > 0) return "Average";
    else "";
  };
  return (
    <div className="border-b flex pb-5 ml-4">
      <img src={hairSalon.mainImage} alt="" className="w-44 h-36 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{hairSalon.name}</h2>
        <div className="flex items-start">
          <Stars reviews={hairSalon.reviews} />
          <p className="ml-2 text-sm">{renderRatingText()}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={hairSalon.priceRange} />
            <p className="mr-4">Mexican</p>
            <p className="mr-4">
              {`
                ${hairSalon.location?.address}, ${hairSalon.location?.zipCode} ${hairSalon.location?.city}`}
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

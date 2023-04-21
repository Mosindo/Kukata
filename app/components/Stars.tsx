import React from "react";
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../utils/calculateReviewRateAverage";

const Stars = ({ reviews, rating }: { reviews: Review[]; rating?: number }) => {
  const calculatedRating = calculateReviewRatingAverage(reviews);
  const reviewRating =
    rating ||
    (typeof calculatedRating === "number"
      ? calculatedRating
      : parseFloat(calculatedRating));

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
      const difference = reviewRating - i;
      if (difference >= 1) stars.push(fullStar);
      else if (difference < 1 && difference > 0) {
        if (difference <= 0.2) stars.push(emptyStar);
        else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else stars.push(emptyStar);
    }

    return stars.map((star, index) => {
      return <Image src={star} alt="" className="w-4 h-4 mr-1" key={index} />;
    });
  };

  return <div className="flex items-center">{renderStars()}</div>;
};

export default Stars;

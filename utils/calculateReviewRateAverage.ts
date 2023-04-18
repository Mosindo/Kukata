import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]) => {
  if (reviews.length === 0) return 0;

  const sum =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  return sum.toFixed(1);
};

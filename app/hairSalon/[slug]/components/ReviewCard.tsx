import { Review } from "@prisma/client";
import Stars from "../../../components/Stars";
import prisma from "../../../../lib/prisma";

interface CustomerType {
  id: number;
  firstName: string;
  lastName: string;
}

const fetchCustomerById = async (id: number): Promise<CustomerType> => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!customer) throw new Error("No customer found with that ID");

  return customer;
};

const ReviewCard = async ({ review }: { review: Review }) => {
  const customer = await fetchCustomerById(review.customerId);

  return (
    <div className="border-b pb-7 mb-7">
      <div className="flex">
        <div className="w-1/6 flex flex-col items-center">
          <div className="rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center">
            <h2 className="text-white text-2xl uppercase">
              {" "}
              {customer.firstName[0]}
              {customer.lastName[0]}
            </h2>
          </div>
          <p className="text-center">
            {customer.firstName} {customer.lastName}
          </p>
          {/*  */}
        </div>
        <div className="ml-10 w-5/6">
          <div className="flex items-center">
            <Stars rating={review.rating} reviews={[]} />
          </div>
          <div className="mt-5">
            <p className="text-lg font-light">{review.comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

import { PRICERANGE, Location } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { SearchParams } from "../page";

const SearchSideBar = ({
  locations,
  searchParams,
}: {
  locations: Location[];
  searchParams: SearchParams;
}) => {
  const priceRange = [
    {
      price: PRICERANGE.CHEAP,
      label: "$",
      className: "border w-full text-reg text-center font-light rounded-l p-2",
    },
    {
      price: PRICERANGE.MEDIUM,
      label: "$$",
      className: "border w-full text-reg text-center font-light p-2",
    },
    {
      price: PRICERANGE.EXPENSIVE,
      label: "$$$",
      className: "border w-full text-reg text-center font-light rounded-r p-2",
    },
  ];
  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">City</h1>
        {locations.map((location) => {
          const newSearchParams = Object.fromEntries(
            Object.entries(searchParams).filter(([key]) => key !== "searchTerm")
          );

          return (
            <Link
              href={{
                pathname: "/search",
                query: { ...newSearchParams, city: location.city },
              }}
              className="font-light text-reg"
              key={location.id}
            >
              {location.city}
            </Link>
          );
        })}
      </div>
      {/* <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        <p className="font-light text-reg">Mexican</p>
        <p className="font-light text-reg">Italian</p>
        <p className="font-light text-reg">Chinese</p>
      </div> */}
      <div className="mt-3 pb-4 flex flex-col">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {priceRange.map(({ price, label, className }) => {
            const newSearchParams = Object.fromEntries(
              Object.entries(searchParams).filter(
                ([key]) => key !== "searchTerm"
              )
            );
            return (
              <Link
                href={{
                  pathname: "/search",
                  query: {
                    ...newSearchParams,
                    price,
                  },
                }}
                className={className}
                key={price}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchSideBar;

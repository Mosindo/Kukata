import { PRICERANGE, Location } from "@prisma/client";
import React from "react";

const SearchSideBar = ({
  locations,
  prices,
}: {
  locations: Location[];
  prices: PRICERANGE[];
}) => {
  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">City</h1>
        {locations.map((location) => (
          <p className="font-light text-reg" key={location.id}>
            {location.city}
          </p>
        ))}
      </div>
      {/* <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        <p className="font-light text-reg">Mexican</p>
        <p className="font-light text-reg">Italian</p>
        <p className="font-light text-reg">Chinese</p>
      </div> */}
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <button className="border w-full text-reg font-light rounded-l p-2">
            $
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2">
            $$
          </button>
          <button className="border-r border-t border-b w-full text-reg font-light p-2 rounded-r">
            $$$
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSideBar;

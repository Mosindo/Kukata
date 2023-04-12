import { PRICERANGE } from "@prisma/client";
import React from "react";

const Price = ({ price }: { price: PRICERANGE }) => {
  const renderPrice = () => {
    switch (price) {
      case PRICERANGE.CHEAP:
        return (
          <>
            <span>$$</span>
            <span className="text-gray-400">$$$</span>
          </>
        );
      case PRICERANGE.MEDIUM:
        return (
          <>
            <span>$$$</span>

            <span className="text-gray-400">$</span>
          </>
        );
      case PRICERANGE.EXPENSIVE:
        return (
          <>
            <span>$$$$</span>
          </>
        );
    }
  };

  return <p className=" flex mr-3">{renderPrice()}</p>;
};

export default Price;

import Link from "next/link";
import React from "react";

const BarberCard = () => {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href="/barber/bobo">
        <img
          src="https://pixabay.com/get/g17b30be0c58d96e613b9c742f9ce69c190efdc46d234fa89ba73934b88ab19f5a07e8b286dc731a023f5f765383a987ceedb13f91b9c92c3c0ff2e2716975b3cdb1344e3a88b5a51eb21db1d22175d68_1280.jpg"
          alt=""
          className="w-full h-36"
        />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">Milestones Grill</h3>
          <div className="flex items-start">
            <div className="flex mb-2">*****</div>
            <p className="ml-2">77 reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">Mexican</p>
            <p className="mr-3">$$$$</p>
            <p>Toronto</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
};

export default BarberCard;

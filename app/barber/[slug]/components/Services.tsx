import React from "react";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Services</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          <ServiceCard />
        </div>
      </div>
    </main>
  );
};

export default Services;

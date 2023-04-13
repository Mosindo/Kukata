import React from "react";
import ServiceCard from "./ServiceCard";
import { Service } from "@prisma/client";

const Services = ({ services }: { services: Service[] }) => {
  return (
    <main className="bg-white mt-5">
      <div>
        <div className="mt-4 pb-1 mb-1">
          <h1 className="font-bold text-4xl">Services</h1>
        </div>
        {services.length ? (
          services.map((service) => (
            <ServiceCard service={service} key={service.id} />
          ))
        ) : (
          <p className="text-lg font-light">No services available</p>
        )}
      </div>
    </main>
  );
};

export default Services;

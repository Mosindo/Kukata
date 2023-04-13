import { Service } from "@prisma/client";
import React from "react";

const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <div className=" border rounded p-3 w-[49%] mb-3">
      <h3 className="font-bold text-lg">{service.name}</h3>
      <p className="font-light mt-1 text-sm">{service.description}</p>
      <p className="mt-7">{`${service.price}€`}</p>
    </div>
  );
};

export default ServiceCard;

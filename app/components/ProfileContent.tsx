"use client";

import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import prisma from "../../lib/prisma";

interface CustomerType {
  id: string;
  firstName: string;
  lastName: string;
}

export const ProfileContent = () => {
  const { error, data } = useContext(AuthenticationContext);

  const fetchCustomerById = async (id: string): Promise<CustomerType> => {
    if (data?.id) {
      const customer = await prisma.customer.findUnique({
        where: {
          userId: data?.id,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      if (error) throw new Error("error found :" + error);
      if (!customer) throw new Error("No customer found with that ID");

      return customer;
    }
  };
  console.log("ProfileContent.tsx: ", data);
  return (
    <div>
      <h1>ProfileContent</h1>
      <p>{data?.email}</p>
      <p>{data?.user_metadata.lastName}</p>
      <p>{data?.user_metadata.firstName}</p>
      <p>{data?.user_metadata.phoneNumber}</p>
      <p>{data?.user_metadata.city}</p>
      <p>{data?.user_metadata.role}</p>
      <hr />
      <p>Use the choose file button below to upload</p>
    </div>
  );
};

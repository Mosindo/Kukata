"use client";

import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";

export const ProfileContent = () => {
  const { error, data } = useContext(AuthenticationContext);

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

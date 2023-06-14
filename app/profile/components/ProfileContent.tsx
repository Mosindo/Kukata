"use client";

import React, { useContext } from "react";
import { AuthenticationContext } from "../../context/AuthContext";

export const ProfileContent = () => {
  const { data } = useContext(AuthenticationContext);

  console.log("profilecontent", data);
  return (
    <div>
      <h1>ProfileContent</h1>
    </div>
  );
};

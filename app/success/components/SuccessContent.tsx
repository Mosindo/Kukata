"use client";
import React from "react";
import useAuth from "../../../hooks/useAuth";

const SuccessContent = () => {
  const { googleSignup } = useAuth();

  // trigger google signup after 300ms
  setTimeout(() => {
    googleSignup();
  }, 30);

  return (
    <div>
      <h1>Success</h1>
    </div>
  );
};

export default SuccessContent;

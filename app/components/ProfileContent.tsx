"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import MultiStepAuthModal from "./multistepAuth/MultiStepAuthModal";

export const ProfileContent = () => {
  const [user, setUser] = useState<any>(null);
  const { error, data, loading } = useContext(AuthenticationContext);

  useEffect(() => {
    async function getUser() {
      try {
        if (data?.id) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (data?.id) {
      getUser();
    }
  }, [data, error, loading]);

  return (
    <div>
      <h1>ProfileContent</h1>
      {loading ? (
        <span className="loading loading-spinner text-success"></span>
      ) : (
        <>
          <p>{user?.email}</p>
          <p>{user?.lastName}</p>
          <p>{user?.firstName}</p>
          <p>{user?.phoneNumber}</p>
          <p>{user?.city}</p>
          <p>{user?.role}</p>
          <hr />
          <p>Use the choose file button below to upload</p>
          <MultiStepAuthModal />
        </>
      )}
    </div>
  );
};

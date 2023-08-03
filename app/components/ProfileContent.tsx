"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { fetchCustomerByUserId } from "../../lib/helpers";

export const ProfileContent = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { error, data, loading } = useContext(AuthenticationContext);

  useEffect(() => {
    async function getUser() {
      console.log("ProfileContent.tsx: ", data);
      try {
        if (data?.id) {
          setIsLoading(true);
          const res = await fetchCustomerByUserId(data?.id);
          setUser(res);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    }

    if (data?.id) {
      getUser();
    }
  }, [data?.id]);

  return (
    <div>
      <h1>ProfileContent</h1>
      {isLoading ? (
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
        </>
      )}
    </div>
  );
};

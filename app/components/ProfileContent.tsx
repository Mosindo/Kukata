"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../lib/database.types";

export const ProfileContent = () => {
  const [user, setUser] = useState<any>(null);
  const [media, setMedia] = useState<any>([]);

  const { error, data, loading } = useContext(AuthenticationContext);

  const supabase = createClientComponentClient<Database>();
  const CDNURL =
    "https://ufczslyhktxdabgthvbi.supabase.co/storage/v1/object/public/avatars/";

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

  async function uploadImage(e: any) {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("avatars")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setMedia(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function deleteImage(imageName: string) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  async function deleteAllImages() {
    const { error } = await supabase.storage.from("avatars").remove([user.id]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  async function updateImage(imageName: string, newImageName: string) {
    const { error } = await supabase.storage
      .from("avatars")
      .update(user.id + "/" + imageName, newImageName, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

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
          <input type="file" onChange={(e) => uploadImage(e)} />

          {media.length > 0 && (
            <Image
              src={CDNURL + user?.id + "/" + media[0].name}
              width={100}
              height={100}
              alt="Picture of the author"
            />
          )}
        </>
      )}
    </div>
  );
};

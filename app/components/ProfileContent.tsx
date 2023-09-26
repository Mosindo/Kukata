"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../lib/database.types";
import { fetchUserRolesById } from "../../lib/helpers";

export const ProfileContent = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [media, setMedia] = useState<any>([]);
  const [images, setImages] = useState<any>([]);

  const { error, data, loading } = useContext(AuthenticationContext);

  const supabase = createClientComponentClient<Database>();
  const CDNURL =
    "https://ufczslyhktxdabgthvbi.supabase.co/storage/v1/object/public/avatars/";

  const PHOTO_GALLERY_PATH =
    "https://ufczslyhktxdabgthvbi.supabase.co/storage/v1/object/public/images/";

  const photo = {
    IMAGES: "images",
    AVATARS: "avatars",
  };
  useEffect(() => {
    async function getUser() {
      try {
        if (data?.id) {
          const profile = await fetchUserRolesById(data?.id);
          setRole(profile.owner.role);
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

  async function uploadImage(e: any, bucketName: string) {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages(bucketName);
    } else {
      console.log(error);
    }
  }

  async function getImages(bucketName: string) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null && bucketName === "avatars") {
      setMedia(data);
    } else if (data !== null && bucketName === "images") {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages(photo.AVATARS);
      getImages(photo.IMAGES);
    }
  }, [user]);

  async function deleteImage(imageName: string, bucketName: string) {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages(bucketName);
    }
  }

  async function deleteAllImages(bucketName: string) {
    const { error } = await supabase.storage.from("avatars").remove([user.id]);

    if (error) {
      alert(error);
    } else {
      getImages(bucketName);
    }
  }

  async function updateImage(
    imageName: string,
    newImageName: string,
    bucketName: string
  ) {
    const { error } = await supabase.storage
      .from(bucketName)
      .update(user.id + "/" + imageName, newImageName, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      alert(error);
    } else {
      getImages(bucketName);
    }
  }
  console.log("userProfile", role, "user:", user);
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
          <p>upload new profile picture</p>
          <input type="file" onChange={(e) => uploadImage(e, "avatars")} />

          {media.length > 0 && (
            <Image
              src={CDNURL + user?.id + "/" + media[0].name}
              width={100}
              height={100}
              alt="Picture of the author"
              className="rounded-full m-10"
            />
          )}
        </>
      )}

      <p>upload new images</p>
      <input type="file" onChange={(e) => uploadImage(e, "images")} />
      <div className="grid grid-cols-4 gap-4  mt-4">
        {role &&
          images.length > 0 &&
          images.map((image: any) => (
            <div className="rounded-lg   " key={image.id}>
              <Image
                src={PHOTO_GALLERY_PATH + user?.id + "/" + image.name}
                width={100}
                height={100}
                alt="Picture of the author"
                className=" h-48 w-48 rounded-lg"
              />

              <button className="text-sm font-medium uppercase tracking-widest text-dark ">
                Buy
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

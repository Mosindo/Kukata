"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../lib/database.types";
import { fetchUserRolesById } from "../../lib/helpers";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export const ProfileContent = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [media, setMedia] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const { error, data } = useContext(AuthenticationContext);
  const router = useRouter();

  const supabase = createClientComponentClient<Database>();
  const CDNURL =
    "https://ufczslyhktxdabgthvbi.supabase.co/storage/v1/object/public/avatars/";
  const GALLERY_PATH =
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

          if (profile.owner?.role === "OWNER") {
            setRole(profile.owner.role);
          }
          if (profile.customer.role === "CUSTOMER") {
            setRole(profile.customer?.role);
          }

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
      .upload(user?.id + "/" + uuidv4(), file);

    if (data) {
      getImages(bucketName);
      router.refresh();
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

    if (data !== null) {
      if (bucketName === "avatars") {
        setMedia(data);
      }

      if (bucketName === "images") {
        setImages(data);
      }

      setLoading(false);
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    getImages(photo.AVATARS);
    getImages(photo.IMAGES);
  }, [user, loading]);

  async function deleteImage(imageName: string, bucketName: string) {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([user?.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages(bucketName);
    }
  }

  async function deleteAllImages(bucketName: string) {
    const { error } = await supabase.storage.from("avatars").remove([user?.id]);

    if (error) {
      alert(error);
    } else {
      getImages(bucketName);
    }
  }

  async function updateImage(e: any, imageName: string, bucketName: string) {
    let newImageName = e.target.files[0];
    console.log("newImageName", newImageName);
    const { error, data } = await supabase.storage
      .from(bucketName)
      .update(user?.id + "/" + imageName, newImageName, {
        upsert: true,
      });
    console.log("updateImage:", data);
    if (data) {
      getImages(bucketName);
      console.log("finished uploading");
      await router.refresh();
    } else {
      console.log(error);
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
          {media.length < 0 && (
            <>
              <p>upload new profile picture</p>
              <input
                type="file"
                onChange={(e) => uploadImage(e, photo.AVATARS)}
              />
            </>
          )}

          {media.length > 0 && (
            <>
              <div className="w-12 rounded-full overflow-hidden  h-12">
                {" "}
                <Image
                  src={CDNURL + user?.id + "/" + media[0].name}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                  priority
                />
              </div>

              <p>update</p>
              <input
                type="file"
                onChange={(e) => updateImage(e, media[0].name, photo.AVATARS)}
              />
            </>
          )}
        </>
      )}

      <div className="grid grid-cols-4 gap-0.5 mt-4">
        {role && images.length > 0 && (
          <>
            <p>upload new images</p>
            <input type="file" onChange={(e) => uploadImage(e, "images")} />
            {images.map((image: any) => (
              <pre className="rounded-lg   " key={image?.id}>
                <Image
                  src={GALLERY_PATH + user?.id + "/" + image.name}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                  className=" h-48 w-48 rounded-lg"
                  priority
                />

                <button className="text-sm font-medium uppercase tracking-widest text-dark ">
                  Buy
                </button>
              </pre>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

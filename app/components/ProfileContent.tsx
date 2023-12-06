"use client";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../lib/database.types";
import { fetchUserRolesById } from "../../lib/helpers";
import { useRouter } from "next/navigation";
import Gallery from "./Gallery";

interface User {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  city: string;
  role: string;
}

type Role = "OWNER" | "CUSTOMER";
interface Media {
  name: string;
}

export const ProfileContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateFileInputRef = useRef<HTMLInputElement>(null);

  const {
    error,
    data,
    loading: userLoading,
  } = useContext(AuthenticationContext);
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
          console.log("profil:", profile);
          if (profile.owner?.role === "OWNER") {
            setRole(profile.owner.role);
          }
          if (profile.customer?.role === "CUSTOMER") {
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

  async function uploadImage(
    e: ChangeEvent<HTMLInputElement>,
    bucketName: string
  ) {
    let file = e.target.files?.[0];
    if (file instanceof File) {
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(user?.id + "/" + uuidv4(), file);

      if (!uploadError) {
        console.log("Image Uploaded, Updating Media State...");

        await getImages(bucketName);

        router.refresh();
      } else {
        console.error("Upload Error:", uploadError);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        setMedia([...data]);
      }

      if (bucketName === "images") {
        setImages(data);
      }

      setLoading(false);
    } else {
      console.log(error);
    }
  }

  async function loadAllImages() {
    await getImages(photo.AVATARS);
    await getImages(photo.IMAGES);
  }

  useEffect(() => {
    if (user && !userLoading) {
      loadAllImages();
    }
  }, [user, userLoading]);

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

  async function updateImage(
    e: ChangeEvent<HTMLInputElement>,
    imageName: string,
    bucketName: string
  ) {
    let newImageName = e.target.files?.[0];
    if (newImageName instanceof File) {
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

    if (updateFileInputRef.current) {
      updateFileInputRef.current.value = "";
    }
  }

  const imageUrl = `${
    CDNURL + user?.id + "/" + media[0]?.name
  }?t=${new Date().getTime()}`;

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
          {media.length === 0 && (
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
                  src={imageUrl}
                  width={100}
                  height={100}
                  placeholder="blur"
                  blurDataURL={imageUrl}
                  priority
                  alt="avatar"
                />
              </div>

              <p>update</p>

              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => updateImage(e, media[0].name, photo.AVATARS)}
                ref={updateFileInputRef}
              />
            </>
          )}
        </>
      )}

      <div className="">
        {role && images.length > 0 && (
          <>
            <p>upload new images</p>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => uploadImage(e, photo.IMAGES)}
              ref={fileInputRef}
            />
            <Gallery images={images} userId={user?.id} path={GALLERY_PATH} />
          </>
        )}
      </div>
    </div>
  );
};

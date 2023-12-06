import Image from "next/image";
import React from "react";

type ImageType = {
  name: string;
};

interface GalleryProps {
  images: ImageType[];
  userId: string | undefined; // Utilise 'string | undefined' si userId peut être undefined
  path: string;
}

const Gallery = ({ images, userId, path }: GalleryProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((image: any) => (
        <Image
          src={`${path + userId + "/" + image.name}?t=${new Date().getTime()}`}
          width={100}
          height={100}
          alt="gallery picture"
          className="h-60 w-60 rounded-lg"
          priority
        />
      ))}
    </div>
  );
};

export default Gallery;
